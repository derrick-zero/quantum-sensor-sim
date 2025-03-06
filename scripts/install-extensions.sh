#!/bin/bash
max_retries=3
retry_delay=3

extensions=(
  # Core Language/Runtime Support
  "ms-dotnettools.csharp"
  "ms-dotnettools.csdevkit"
  "ms-python.python"

  # Python Tooling Enhancements
  "ms-python.black-formatter"
  "ms-python.pylance"
  "ms-python.pylint"

  # Code Formatting and Linting
  "dbaeumer.vscode-eslint"
  "esbenp.prettier-vscode"
  "stylelint.vscode-stylelint"
  "editorconfig.editorconfig"

  # Unity-Specific Tools
  "Unity.unity-debug"
  "visualstudiotoolsforunity.vstuc"

  # Version Control and Git
  "eamodio.gitlens"
  "github.copilot"
  "github.copilot-chat"
  "github.remotehub"

  # Remote Development
  "ms-vscode-remote.remote-wsl"
  "ms-vscode-remote.remote-containers"

  # API/Documentation and Additional Tools
  "42crunch.vscode-openapi"
  "redhat.vscode-yaml"
  "ms-vscode.copilot-mermaid-diagram"

  # Visualization, Security, and Quality
  "ibm.output-colorizer"
  "ms-cst-e.vscode-devskim"
  "sonarsource.sonarlint-vscode"
)

install_extension() {
  local ext=$1
  local retries=0
  local installed=0

  while [ $retries -lt $max_retries ]; do
    echo "Installing $ext (Attempt $((retries+1)))..."
    code --install-extension "$ext" --force
    if code --list-extensions | grep -q "^$ext\$"; then
      echo "$ext installed successfully."
      installed=1
      break
    else
      echo "Failed to install $ext. Retrying in $retry_delay seconds..."
      sleep $retry_delay
    fi
    ((retries++))
  done

  if [ $installed -ne 1 ]; then
    echo "Error: Failed to install $ext after $max_retries attempts."
  fi
}

for extension in "${extensions[@]}"; do
  install_extension "$extension"
done
