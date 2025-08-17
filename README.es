¡Gracias, Cesar! Con las capturas que enviaste, queda claro que cada prueba tiene su propia fórmula de CutOff, por ejemplo:

HIV 1,2: (NC1 + 0.120) × 0.9 (para NO REACTIVO), (NC1 + 0.120) × 1.1 (para REACTIVO)
HBSAG: (valor fijo) × 0.9 y × 1.1
ANTI-HBC: (NC1 × 0.5) × 0.9, etc.
HTLV I,II y SÍFILIS: (NC1 + 0.180) × 0.9, etc.
ANTI-HCV: (NC1 + 0.120) × 0.9, etc.
¿Qué significa esto?
El sistema debe poder asociar cada prueba a su fórmula de CutOff y aplicar la fórmula correcta automáticamente al calcular el índice.

¿Cómo lo implementamos?
Podemos crear un arreglo PHP donde se define la fórmula para cada prueba, y el sistema la aplica según la prueba seleccionada.

¿Quieres que te ayude a estructurar ese arreglo y el código para que aplique la fórmula adecuada automáticamente según la prueba?



Aquí tienes cómo puedes ajustar tu flujo para que, al seleccionar CHAGAS, se recorran todos los archivos de esa prueba y se agreguen todos los índices al gráfico, ordenados por fecha:

Cambia esta parte:
Actualmente, tu código para CHAGAS probablemente se detiene después de encontrar el primer valor. Debes asegurarte de que para cada archivo, si encuentra el valor necesario, lo agregue a $indices_por_fecha y continúe con el siguiente archivo.