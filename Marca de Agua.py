from PIL import Image, ImageOps
import os

# Rutas
carpeta_imagenes = 'C:/Users/rmzar/Documents/Trabajos/Inmobiliaria/Maru/Casa'  # <- Cambia esto por tu carpeta de imágenes
marca_agua_path = 'C:/Users/rmzar/Documents/Trabajos/Inmobiliaria/Marca de Agua 3.png'  # <- Cambia esto por tu logo en PNG con fondo transparente

# Cargar la marca de agua
marca_agua = Image.open(marca_agua_path).convert("RGBA")

# Recorre todas las imágenes de la carpeta
for archivo in os.listdir(carpeta_imagenes):
    if archivo.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
        ruta_imagen = os.path.join(carpeta_imagenes, archivo)
        imagen = Image.open(ruta_imagen)

        # Corrige la orientación según los metadatos EXIF
        imagen = ImageOps.exif_transpose(imagen).convert("RGBA")

        # Redimensionar la marca de agua al 20% del ancho de la imagen
        escala = 0.2
        nuevo_ancho = int(imagen.width * escala)
        ratio = nuevo_ancho / marca_agua.width
        nuevo_alto = int(marca_agua.height * ratio)
        marca_agua_redimensionada = marca_agua.resize((nuevo_ancho, nuevo_alto), Image.LANCZOS)

        # Posición centrada
        posicion = (
            (imagen.width - marca_agua_redimensionada.width) // 2,
            (imagen.height - marca_agua_redimensionada.height) // 2
        )

        # Coloca la marca de agua
        imagen_con_marca = Image.alpha_composite(imagen, Image.new("RGBA", imagen.size))
        imagen_con_marca.paste(marca_agua_redimensionada, posicion, marca_agua_redimensionada)

        # Guardar en formato RGB
        imagen_final = imagen_con_marca.convert("RGB")
        nombre_salida = "wa " + os.path.splitext(archivo)[0] + ".jpg"
        ruta_salida = os.path.join(carpeta_imagenes, nombre_salida)
        imagen_final.save(ruta_salida, quality=95)

        print(f"✅ Marca de agua añadida (con orientación corregida) a: {archivo}")
