# Requisitos del Proyecto: Flack

## Objetivos
- Usar JavaScript para ejecutar código del lado del servidor.
- Familiarizarse con la construcción de interfaces web de usuario.
- Ganar experiencia con Socket.IO para la comunicación entre clientes y servidor.

## Requisitos Funcionales

1. **Display Name:**
   - Al visitar la aplicación por primera vez, el usuario debe ingresar un display name.
   - El display name debe recordarse incluso si el usuario cierra y vuelve a abrir la página.

2. **Channel Creation:**
   - Cualquier usuario puede crear un canal nuevo, siempre que el nombre no exista ya.

3. **Channel List:**
   - Los usuarios pueden ver la lista de canales existentes y seleccionar uno para ver sus mensajes.

4. **Messages View:**
   - Al seleccionar un canal, el usuario ve los mensajes enviados en ese canal (máximo 100 mensajes).
   - Solo se almacenan los 100 mensajes más recientes por canal en memoria del servidor.

5. **Sending Messages:**
   - Los usuarios pueden enviar mensajes en tiempo real en un canal.
   - Cada mensaje debe mostrar el display name y la hora.
   - Los mensajes deben aparecer instantáneamente para todos los usuarios del canal, sin recargar la página.

6. **Remembering the Channel:**
   - Si el usuario cierra el navegador y vuelve, la app debe recordar el canal en el que estaba y llevarlo allí automáticamente.

7. **Personal Touch:**
   - Agregar al menos una funcionalidad extra a elección (ej: borrar mensajes propios, adjuntar archivos, mensajes privados, etc).

8. **README.md:**
   - Incluir una breve descripción del proyecto, contenido de cada archivo y explicación de la funcionalidad extra implementada.
   - Añadir cualquier dependencia extra en `requirements.txt` si corresponde.

## Notas
- No es necesario usar base de datos; los datos pueden almacenarse en variables globales en el servidor.
- Se recomienda usar localStorage para guardar datos del lado del cliente.
- El diseño y funcionalidades adicionales quedan a criterio del desarrollador, siempre que se cumplan los requisitos anteriores. 