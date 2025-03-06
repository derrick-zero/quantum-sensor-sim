# Quantum Sensor Sim Tech Stack

## Introduction

Quantum Sensor Sim is designed as a VR simulation game built with a robust, consistent, and compliant development environment. This document outlines the full tech stack, discusses the rationale for each technology, and summarizes licensing and compliance considerations.

## Host Environment

- **Operating System:** Windows 10/11
  *Chosen for compatibility with Unity Editor, WinGet, Git for Windows, and other core tools.*

- **IDE:** Visual Studio Code
  *Configured to emulate Visual Studio Professional with essential extensions, keybindings, and settings.*

## Remote Development Environment

- **WSL2 with Debian GNU/Linux**
  *Provides a native Linux environment for running build tools, Node.js, Python, .NET SDK, and scripts while integrating seamlessly with Windows.*

## Core Technologies

- **Unity Editor:**
  - Version: Unity 2021 LTS or latest stable LTS
  - Packages: Input System, Cinemachine, Post Processing, XR Interaction Toolkit

- **Languages and Runtimes:**
  - **C# with .NET SDK:** Primary language for Unity scripting
  - **Python:** For scripting, testing, and auxiliary tools
  - **Node.js & TypeScript:** For tooling, build scripts, and potential web interfaces

## Development Tools

- **Version Control:**
  - Git (with Git LFS for large Unity assets)
  - GitHub for repository hosting, issues, and CI/CD integration

- **Testing Frameworks:**
  - Unity Test Framework for in-editor testing
  - NUnit for additional C# testing
  - Jest for JavaScript/TypeScript testing

- **Documentation Tools:**
  - DocFX for generating project documentation from code comments and markdown files

## VS Code Extensions (Quantum Sensor Sim Extension Pack)

Our extension pack is divided into the following groups:

1. **Core Language/Runtime Support:**
   - `ms-dotnettools.csharp`
   - `ms-dotnettools.csdevkit`
   - `ms-python.python`

2. **Python Tooling Enhancements:**
   - `ms-python.black-formatter`
   - `ms-python.pylance`
   - `ms-python.pylint`

3. **Code Formatting and Linting:**
   - `dbaeumer.vscode-eslint`
   - `esbenp.prettier-vscode`
   - `stylelint.vscode-stylelint`
   - `editorconfig.editorconfig`

4. **Unity Specific Tools:**
   - `Unity.unity-debug`
   - `visualstudiotoolsforunity.vstuc`

5. **Version Control and Git:**
   - `eamodio.gitlens`
   - `github.copilot`
   - `github.copilot-chat`
   - `github.remotehub`

6. **Remote Development:**
   - `ms-vscode-remote.remote-wsl`
   - `ms-vscode-remote.remote-containers`

7. **API/Documentation Tools:**
   - `42crunch.vscode-openapi`
   - `redhat.vscode-yaml`
   - `ms-vscode.copilot-mermaid-diagram`

8. **Visualization, Security & Quality:**
   - `ibm.output-colorizer`
   - `ms-cst-e.vscode-devskim`
   - `sonarsource.sonarlint-vscode`

## Licensing & Compliance

All extensions and tools are sourced from reputable vendors and open-source projects under permissive licenses (MIT, Apache 2.0, etc.). We maintain regular audits using dependency-check tools to ensure compliance with US and EU regulations.

## CI/CD & Automation

- **GitHub Actions:**
  Automates testing, building, and integration.
- **Scheduled Integrity Checks:**
  Scripts to verify extension pack functionality.

---

This document will be updated as our toolset evolves.

