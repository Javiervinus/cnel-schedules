# Rastreador de Cortes de Luz de CNEL EP

[![Astro](https://img.shields.io/badge/Astro-0C1222?logo=astro&logoColor=FF5D01)](https://astro.build/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-000000?logo=github&logoColor=white)](https://ui.shadcn.com/)

## Descripción

Esta aplicación web te permite consultar los cortes de luz programados por **CNEL EP** en Ecuador. Desarrollada con **Astro**, **React** y **Shadcn/UI**, ofrece la misma información que la página oficial de [CNEL EP](https://serviciosenlinea.cnelep.gob.ec/cortes-energia/), pero con detalles adicionales y una experiencia de usuario más fluida.

## Características

- Consulta sencilla de los cortes de luz en tu área.
- Información detallada sobre fechas, horarios y zonas afectadas.
- Interfaz amigable que mejora la usabilidad respecto al sitio oficial.

## Tecnologías Utilizadas

- [**Astro**](https://astro.build/): Framework moderno para construir sitios web rápidos.
- [**React**](https://reactjs.org/): Biblioteca de JavaScript para interfaces de usuario interactivas.
- [**Shadcn/UI**](https://ui.shadcn.com/): Colección de componentes UI para React.

## Instalación

1. **Clona** este repositorio:

   ```bash
   git clone https://github.com/tuusuario/tu-repositorio.git
   ```

2. **Entra** al directorio del proyecto:

   ```bash
   cd tu-repositorio
   ```

3. **Instala** las dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

## Uso

1. **Inicia** el servidor de desarrollo:

   ```bash
   npm run dev
   # o
   yarn dev
   ```

2. **Abre** `http://localhost:4321` en tu navegador para usar la aplicación.

## Información de la API

La aplicación utiliza la API oficial de CNEL EP para obtener los datos de los cortes de luz:

```javascript
const response = await fetch(
  `https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/${idValue}/${idType}`
);
```

- **`idValue`**: Tu número de identificación.
- **`idType`**: Tipo de identificación.

---

_Creado por diversión y para practicar. ¡Espero que te sea útil!_
