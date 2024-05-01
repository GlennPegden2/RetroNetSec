echo "Preconfigured images of historic OSs for use with the RetroNetSec security preservation project" | find ./hosts -type f \( -name "*.img" -o -name "*.txt" \) -exec zip -z RetroNetSecImages.zip {} +

