# Maximum number of retries per extension
$maxRetries = 3
$retryDelaySeconds = 3

$extensions = @(
  # Core Language/Runtime Support
  "ms-dotnettools.csharp",
  "ms-dotnettools.csdevkit",
  "ms-python.python",

  # Python Tooling Enhancements
  "ms-python.black-formatter",
  "ms-python.pylance",
  "ms-python.pylint",

  # Code Formatting and Linting
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode",
  "stylelint.vscode-stylelint",
  "editorconfig.editorconfig",

  # Unity-Specific Tools
  "Unity.unity-debug",
  "visualstudiotoolsforunity.vstuc",

  # Version Control and Git
  "eamodio.gitlens",
  "github.copilot",
  "github.copilot-chat",
  "github.remotehub",

  # Remote Development
  "ms-vscode-remote.remote-wsl",
  "ms-vscode-remote.remote-containers",

  # API/Documentation and Additional Tools
  "42crunch.vscode-openapi",
  "redhat.vscode-yaml",
  "ms-vscode.copilot-mermaid-diagram",

  # Visualization, Security, and Quality
  "ibm.output-colorizer",
  "ms-cst-e.vscode-devskim",
  "sonarsource.sonarlint-vscode"
)

function Install-ExtensionWithRetry($extensionId) {
    $retry = 0
    $installed = $false
    while (-not $installed -and $retry -lt $maxRetries) {
        try {
            Write-Host "Attempting to install $extensionId (try $($retry + 1))..."
            code --install-extension $extensionId -n
            # Check if installation succeeded by listing installed extensions
            $installedExtensions = code --list-extensions
            if ($installedExtensions -contains $extensionId) {
                Write-Host "$extensionId installed successfully."
                $installed = $true
            } else {
                throw "Installation check failed."
            }
        } catch {
            Write-Warning "Failed to install $extensionId. Retrying in $retryDelaySeconds seconds..."
            Start-Sleep -Seconds $retryDelaySeconds
        }
        $retry++
    }
    if (-not $installed) {
        Write-Error "Failed to install $extensionId after $maxRetries attempts."
    }
}

foreach ($ext in $extensions) {
    Install-ExtensionWithRetry $ext
}
