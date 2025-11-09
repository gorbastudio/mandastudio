# Guía de Integración: Web App <> App Nativa Android

**Versión:** 1.1
**Fecha:** 2024-07-26

## 1. Introducción

Este documento describe la interfaz de comunicación (el "puente") entre la Web App y la aplicación contenedora nativa de Android. La aplicación Android expone un objeto JavaScript global llamado `window.Android` que permite a la Web App acceder a información del dispositivo, controlar elementos nativos de la UI y utilizar un almacenamiento de archivos persistente para una experiencia de usuario más integrada.

Es crucial verificar siempre la existencia del objeto `window.Android` antes de intentar usarlo para garantizar que la Web App siga funcionando de forma independiente en navegadores web estándar.

**Ejemplo de verificación:**

```javascript
if (window.Android) {
  // Estamos dentro de la app nativa, podemos usar la interfaz
} else {
  // Estamos en un navegador web normal
}
```

---

## 2. Funciones Disponibles

A continuación se detallan las funciones expuestas por el objeto `window.Android`.

### 2.1. Obtener Información del Dispositivo

Permite a la Web App obtener un conjunto de datos sobre el estado y las características del dispositivo en el que se está ejecutando.

- **Función:** `getDeviceInfo()`
- **Retorna:** `String` - Una cadena de texto en formato JSON que contiene la información del dispositivo.

**Uso en JavaScript:**

```javascript
function getNativeDeviceInfo() {
  if (window.Android && typeof window.Android.getDeviceInfo === 'function') {
    try {
      const deviceInfoJson = window.Android.getDeviceInfo();
      return JSON.parse(deviceInfoJson);
    } catch (e) {
      console.error("Error al obtener la información del dispositivo desde Android", e);
      return null;
    }
  } 
  return null;
}
```

**Propiedades del objeto JSON devuelto:**

| Propiedad           | Tipo      | Descripción                                                                                           |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `isOnline`          | `Boolean` | `true` si el dispositivo tiene conexión a internet (WiFi o datos móviles), de lo contrario `false`.        |
| `screenWidth`       | `Number`  | El ancho de la pantalla del dispositivo en píxeles.                                                   |
| `screenHeight`      | `Number`  | El alto de la pantalla del dispositivo en píxeles.                                                    |
| `screenDensity`     | `Number`  | La densidad lógica de la pantalla (ej. 1.0, 1.5, 2.0). Útil para cálculos de `dp`.                     |
| `screenDensityDpi`  | `Number`  | La densidad de la pantalla en puntos por pulgada (DPI) (ej. 160, 240, 320).                            |
| `language`          | `String`  | El código de idioma y región del dispositivo (ej. "es-ES", "en-US").                                      |
| `androidVersion`    | `String`  | La versión pública del sistema operativo Android (ej. "12", "13").                                     |
| `sdkVersion`        | `Number`  | El nivel de la API del SDK de Android (ej. 31, 33).                                                   |
| `isDarkMode`        | `Boolean` | `true` si el sistema operativo está configurado en modo oscuro, de lo contrario `false`.                |

### 2.2. Cambiar Color de las Barras del Sistema

Permite a la Web App cambiar dinámicamente el color de la **barra de estado** y de la **barra de navegación** de la aplicación Android.

- **Función:** `setSystemBarColors(colorHex)`
- **Parámetros:**
  - `colorHex` (`String`): El color deseado en formato hexadecimal de 6 dígitos (`#RRGGBB`).
- **Retorna:** `void`

**Uso en JavaScript:**

```javascript
function setNativeSystemBarsColor(colorHex) {
  if (window.Android && typeof window.Android.setSystemBarColors === 'function') {
    if (/^#[0-9A-F]{6}$/i.test(colorHex)) {
      window.Android.setSystemBarColors(colorHex);
    } else {
      console.warn("Formato de color inválido. Se requiere #RRGGBB.");
    }
  }
}
```

### 2.3. Gestión de Almacenamiento Persistente

Esta API proporciona un sistema de ficheros simple para que la Web App pueda guardar, leer y eliminar datos de forma persistente. Los archivos se almacenan en una carpeta privada y segura dentro de la aplicación, por lo que no son accesibles por otras apps y se eliminan al desinstalar la aplicación.

#### 2.3.1. Guardar un Archivo

- **Función:** `saveFile(fileName, content)`
- **Parámetros:**
  - `fileName` (`String`): El nombre del archivo (ej. `"config.json"`). No debe contener `/` ni `\`.
  - `content` (`String`): El contenido que se desea guardar en el archivo.
- **Retorna:** `String` - Un objeto JSON que indica el resultado. Ej: `"{\"success\": true}"` o `"{\"success\": false, \"error\": \"...\"}"`.

#### 2.3.2. Leer un Archivo

- **Función:** `readFile(fileName)`
- **Parámetros:**
  - `fileName` (`String`): El nombre del archivo a leer.
- **Retorna:** `String | null` - El contenido del archivo como una cadena de texto, o `null` si el archivo no existe.

#### 2.3.3. Eliminar un Archivo

- **Función:** `deleteFile(fileName)`
- **Parámetros:**
  - `fileName` (`String`): El nombre del archivo a eliminar.
- **Retorna:** `String` - Un objeto JSON que indica el resultado.

#### 2.3.4. Listar Archivos

- **Función:** `listFiles()`
- **Retorna:** `String` - Un array JSON con los nombres de todos los archivos guardados. Ej: `"[\"config.json\", \"user_session.dat\"]"`.

**Uso en JavaScript (Ejemplo Completo):**

```javascript
const StorageManager = {
  save: function(fileName, dataObject) {
    if (!window.Android) return false;
    try {
      const content = JSON.stringify(dataObject);
      const result = JSON.parse(window.Android.saveFile(fileName, content));
      if (!result.success) console.error('Error al guardar:', result.error);
      return result.success;
    } catch (e) {
      console.error('Error en StorageManager.save:', e);
      return false;
    }
  },
  
  read: function(fileName) {
    if (!window.Android) return null;
    try {
      const content = window.Android.readFile(fileName);
      return content ? JSON.parse(content) : null;
    } catch (e) {
      console.error('Error en StorageManager.read:', e);
      return null;
    }
  },
  
  delete: function(fileName) {
    if (!window.Android) return false;
    const result = JSON.parse(window.Android.deleteFile(fileName));
    return result.success;
  },
  
  list: function() {
    if (!window.Android) return [];
    return JSON.parse(window.Android.listFiles());
  }
};

// --- EJEMPLOS DE USO ---

// 1. Guardar una configuración de usuario
const userPrefs = { theme: 'dark', lang: 'es' };
StorageManager.save('user_prefs.json', userPrefs);

// 2. Leer la configuración al iniciar
const loadedPrefs = StorageManager.read('user_prefs.json');
if (loadedPrefs) {
  console.log('Preferencias cargadas:', loadedPrefs);
}

// 3. Listar todos los archivos
const allFiles = StorageManager.list();
console.log('Archivos guardados:', allFiles); // --> ["user_prefs.json"]

// 4. Eliminar el archivo
StorageManager.delete('user_prefs.json');
console.log('Archivos después de borrar:', StorageManager.list()); // --> []
```

---

Fin del documento.
