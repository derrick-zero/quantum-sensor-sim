# Quantum Sensor Sim Tech Stack

## Introduction

Quantum Sensor Sim is designed as a VR simulation game built with a robust, consistent, and compliant development environment. This document outlines the full tech stack, the rationale behind each technology choice, and summarizes licensing and compliance considerations.

## Host Environment

- **Operating System:** Windows 10/11
  _Chosen for compatibility with the Unity Editor, WinGet, Git for Windows, and other core tools._

- **IDE:** Visual Studio Code
  _Configured to emulate Visual Studio Professional with essential extensions, keybindings, and settings._

## Remote Development Environment

- **WSL2 with Debian GNU/Linux**
  _Provides a native Linux environment for running build tools, Node.js, Python, .NET SDK, and scripts while integrating seamlessly with Windows._

## Core Technologies

- **Unity Editor:**

  - **Version:** Unity 2021 LTS or latest stable LTS
  - **Packages:** Input System, Cinemachine, Post Processing, XR Interaction Toolkit

- **Languages and Runtimes:**
  - **C# with .NET SDK:** Primary language for Unity scripting.
  - **Python:** For scripting, testing, and auxiliary tools.
  - **Node.js & TypeScript:** For tooling, build scripts, and potential web interfaces.

## Development Tools

- **Version Control:**

  - Git (with Git LFS for large Unity assets)
  - GitHub for repository hosting, issue tracking, and CI/CD integration.

- **Testing Frameworks:**

  - Unity Test Framework for in-editor testing.
  - NUnit for additional C# testing.
  - Jest for JavaScript/TypeScript testing.
  - Cypress for end-to-end testing.

- **Documentation Tools:**
  - DocFX for generating project documentation from code comments and markdown files.

## VS Code Extensions (Quantum Sensor Sim Extension Pack)

Our extension pack is organized into these groups:

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

All extensions and tools are sourced from reputable vendors and active open-source projects under permissive licenses (MIT, Apache 2.0, etc.). We maintain regular dependency audits and compliance checks using automated tools to ensure adherence to US and EU regulations.

## CI/CD & Automation

- **GitHub Actions:**
  Automates testing, building, and integration workflows.

- **Scheduled Integrity Checks:**
  Scripts and automated testing frameworks regularly verify the functionality of the extension pack, build pipelines, and dependency health.

## Future Considerations

- **Advanced Physics Modeling:**
  As the simulation evolves, additional modules for acoustics, thermodynamics, gravitational interactions, and nuclear physics may be integrated.

- **VR & Extended Reality:**
  Future plans include integrating VR via WebXR or native Unity VR support.

- **Scalability and Performance:**
  We will continue to optimize architecture with spatial partitioning, multi-threading (e.g., Web Workers), and hardware acceleration as necessary.
