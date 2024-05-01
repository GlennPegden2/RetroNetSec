find .\hosts -type f \( -name "*.img" -o -name "*.txt" \) -exec zip RetroNetSecImages.zip {} +
zip RetroNetSecImages.zip -z  "Preconfigured images of historic OSs for use with the RetroNetSec security preservation project"

