# Code Injection System Design Document

## Problem Statement

The AI chat's "Add to Editor" functionality is experiencing a critical regression where:
- Clicking "Add to Editor" overwrites the entire editor content instead of inserting at cursor
- This happens specifically when "mouse focused on last line"
- Debug attempts show '//LOADING' being added instead of expected behavior

## Root Cause Analysis

### Current Implementation Issues

1. **Multiple Code Sources Confusion**
   ```javascript
   // We're trying 3 different sources:
   context?.activeCode                          // State-based
   context?.editorRef?.current?.code           // Editor property
   context?.editorRef?.current?.editor?.state?.doc.toString() // CodeMirror direct
   ```
   **Problem**: These may not be in sync, leading to stale state

2. **Cursor Position Reliability**
   ```javascript
   const currentCursor = editor.getCursorLocation();
   ```
   **Problem**: May return invalid position or be out of sync with actual content

3. **State vs Reality Mismatch**
   - `activeCode` might be stale from last evaluation
   - Editor content might have changed since last sync
   - Cursor position might be relative to different content version

## Design Requirements

### Core Principles
1. **Single Source of Truth** - Use ONE authoritative source for current content
2. **Real-time Accuracy** - Always get live editor state, not cached state
3. **Defensive Programming** - Validate all positions and content before operations
4. **Atomic Operations** - All changes should be transactional

### Functional Requirements
1. **Insert at cursor position** - Never replace entire content
2. **Preserve existing content** - Both before and after cursor
3. **Handle edge cases** - Start of file, end of file, empty file
4. **Maintain formatting** - Appropriate spacing and newlines
5. **Update cursor position** - Move to end of inserted content

## Technical Design

### Architecture Decision: Direct CodeMirror Integration

**Rationale**: Skip intermediate state layers and work directly with CodeMirror
- More reliable than context state
- Real-time accuracy
- Industry standard approach

### New Implementation Strategy

```javascript
// 1. SINGLE SOURCE OF TRUTH
const getEditorState = () => {
  const cmEditor = context?.editorRef?.current?.editor;
  if (!cmEditor) return null;
  
  return {
    doc: cmEditor.state.doc,
    selection: cmEditor.state.selection.main,
    content: cmEditor.state.doc.toString()
  };
};

// 2. ATOMIC INSERTION
const injectCodeAtCursor = (code) => {
  const editorState = getEditorState();
  if (!editorState) return false;
  
  const { doc, selection } = editorState;
  const insertPos = selection.head; // Current cursor position
  
  // 3. TRANSACTION-BASED UPDATE
  const transaction = editorState.cmEditor.state.update({
    changes: {
      from: insertPos,
      to: insertPos,
      insert: formatCodeForInsertion(code, insertPos, doc)
    },
    selection: {
      anchor: insertPos + code.length,
      head: insertPos + code.length
    }
  });
  
  editorState.cmEditor.dispatch(transaction);
  return true;
};
```

### Data Flow

```
User clicks "Add to Editor"
    ↓
Get live CodeMirror state
    ↓
Validate cursor position
    ↓
Create insertion transaction
    ↓
Apply atomically to editor
    ↓
Update cursor position
```

### Error Handling Strategy

1. **Validation Gates**
   ```javascript
   if (!context?.editorRef?.current?.editor) {
     showError("Editor not available");
     return;
   }
   ```

2. **Position Validation**
   ```javascript
   const docLength = doc.toString().length;
   const safePosition = Math.max(0, Math.min(insertPos, docLength));
   ```

3. **Transaction Rollback**
   ```javascript
   try {
     editor.dispatch(transaction);
   } catch (error) {
     console.error('Injection failed:', error);
     showError("Failed to insert code");
   }
   ```

## Testing Strategy

### Test Cases
1. **Empty editor** - First insertion
2. **Start of content** - Cursor at position 0
3. **Middle of line** - Split existing line
4. **End of line** - Append to line
5. **End of document** - Final position
6. **Multiple insertions** - Sequential additions
7. **Large content** - Performance with big files

### Debug Instrumentation
```javascript
const debugInject = (action, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[CodeInject] ${action}:`, data);
  }
};
```

## Implementation Plan

### Phase 1: Core Fix
1. Remove all debug logging from current implementation
2. Implement direct CodeMirror integration
3. Add basic validation
4. Test core insertion functionality

### Phase 2: Edge Cases
1. Handle all cursor position edge cases
2. Improve formatting logic
3. Add comprehensive error handling
4. Test with various content types

### Phase 3: Polish
1. Optimize performance
2. Add user feedback for errors
3. Document the final API
4. Remove temporary debugging

## Risk Mitigation

### Backwards Compatibility
- Keep existing `injectCode` function signature
- Graceful degradation if CodeMirror not available
- Fallback to simple append if insertion fails

### Performance
- Minimize DOM operations
- Use CodeMirror's efficient transaction system
- Avoid string manipulation on large documents

### User Experience
- Immediate visual feedback
- Clear error messages
- Undo support through CodeMirror's history

## Success Criteria

1. ✅ **No content overwrites** - Existing content always preserved
2. ✅ **Accurate insertion** - Code appears exactly at cursor position
3. ✅ **Proper formatting** - Appropriate spacing and newlines
4. ✅ **Cursor positioning** - Cursor moves to end of inserted content
5. ✅ **Error handling** - Graceful failure with user feedback
6. ✅ **Performance** - Fast insertion even with large documents

This design prioritizes reliability and correctness over complexity, using CodeMirror's proven transaction system rather than trying to manage state synchronization manually.