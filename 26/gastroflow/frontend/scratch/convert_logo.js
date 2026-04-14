import potrace from 'potrace';
import fs from 'fs';
import path from 'path';

const inputPath = 'c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/frontend/src/assets/logo_gastroflow.png';
const outputPath = 'c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/frontend/src/assets/logo_gastroflow.svg';

potrace.trace(inputPath, function(err, svg) {
    if (err) throw err;
    
    // Añadimos currentColor para permitir cambiar el color vía CSS
    const customizableSvg = svg.replace('<path', '<path fill="currentColor"');
    
    fs.writeFileSync(outputPath, customizableSvg);
    console.log('SVG creado exitosamente en:', outputPath);
});
