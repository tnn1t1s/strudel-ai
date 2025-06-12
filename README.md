# Strudel-AI

**AI-Powered Live Coding for Electronic Music**

Strudel-AI is a fork of [Strudel](https://github.com/tidalcycles/strudel) that brings artificial intelligence to live coding music creation. Combining the power of TidalCycles pattern language with real-time AI assistance, Strudel-AI enables musicians to create electronic music through natural language conversation.

## ✨ Key Features

- 🤖 **AI Music Assistant**: Generate Strudel patterns using natural language
- 🎵 **Musical Intelligence**: AI understands rhythm, harmony, and electronic music styles  
- 🔄 **Context Awareness**: AI sees your current patterns and builds musically coherent additions
- 🎛️ **Multi-Provider Support**: OpenAI and Anthropic integration via LangChain
- 🚀 **Real-Time Integration**: Seamlessly inject AI-generated code into your live session

## 🎯 AI Live Coding Workflow

Instead of manually coding every pattern, simply tell the AI what you want:

- *"add a 909 kick pattern"* → `sound("bd ~ ~ ~").bank("RolandTR909")`
- *"create a bassline like Peter Hook"* → Contextual bass patterns
- *"make it more syncopated"* → Rhythmic variations on existing patterns
- *"add some ambient pads"* → Atmospheric textures
- *"create a simple break using 707 sounds that sounds liki alberto balsam by aphex twin"* → multi-track drumloop code

## 🌟 Based on Strudel

Built on the foundation of [Strudel](https://github.com/tidalcycles/strudel) - a browser-based implementation of TidalCycles that brings live coding to web technologies.

**Original Strudel:**
- Try it: <https://strudel.cc>
- Docs: <https://strudel.cc/learn>
- Community: [TidalCycles Discord](https://discord.com/invite/HGEdXmRkzT)

## Running Locally

After cloning the project, you can run the REPL locally:

1. Install [Node.js](https://nodejs.org/)
2. Install [pnpm](https://pnpm.io/installation)
3. Install dependencies by running the following command:
   ```bash
   pnpm i
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Using Strudel In Your Project

This project is organized into many [packages](./packages), which are also available on [npm](https://www.npmjs.com/search?q=%40strudel).

Read more about how to use these in your own project [here](https://strudel.cc/technical-manual/project-start).

You will need to abide by the terms of the [GNU Affero Public Licence v3](LICENSE.md). As such, Strudel code can only be shared within free/open source projects under the same license -- see the license for details.

Licensing info for the default sound banks can be found over on the [dough-samples](https://github.com/felixroos/dough-samples/blob/main/README.md) repository.

## Contributing

There are many ways to contribute to this project! See [contribution guide](./CONTRIBUTING.md).

<a href="https://github.com/tidalcycles/strudel/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tidalcycles/strudel" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Community

There is a #strudel channel on the TidalCycles discord: <https://discord.com/invite/HGEdXmRkzT>

You can also ask questions and find related discussions on the tidal club forum: <https://club.tidalcycles.org/>

The discord and forum is shared with the haskell (tidal) and python (vortex) siblings of this project.
