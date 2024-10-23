const CloneMode = {
  CLONE_NODE: 0, // Clonar el nodo completo (por defecto)
  INNER_HTML: 1, // Usar innerHTML
  TEXT_CONTENT: 2, // Usar textContent
};

const defaultOptions = {
  titleId: "page-title",
  appBarTitleId: "appbar-title",
  cloneMode: CloneMode.CLONE_NODE,
  removeLeadingIcons: true,
  maxFontSize: 16,
  appBarHeight: 56,
};

const observeTitle = (options = {}) => {
  const {
    titleId,
    appBarTitleId,
    cloneMode,
    removeLeadingIcons,
    maxFontSize,
    appBarHeight,
  } = { ...defaultOptions, ...options };

  const title = document.getElementById(titleId);
  const appBarTitle = document.getElementById(appBarTitleId);
  const leadingIcons = document.getElementById("leading-actions");

  if (!title || !appBarTitle || !leadingIcons) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Título visible, ocultar el título en el Appbar y mostrar los íconos
          appBarTitle.classList.add("opacity-0");
          appBarTitle.classList.remove("opacity-100");

          if (removeLeadingIcons) {
            leadingIcons.classList.add("opacity-100");
            leadingIcons.classList.remove("opacity-0");
          }
        } else {
          // Limpiar el contenido actual del Appbar
          appBarTitle.innerHTML = "";

          // Obtenemos el tamaño de fuente original del título
          const titleFontSize = parseFloat(
            window.getComputedStyle(title).fontSize
          );

          if (cloneMode === CloneMode.CLONE_NODE) {
            // Clonamos el nodo completo con todo el HTML y atributos
            const clonedTitle = title.cloneNode(true);

            // Remover márgenes y paddings
            clonedTitle.style.margin = "0";
            clonedTitle.style.padding = "0";
            clonedTitle.style.maxWidth = "100%";

            // Solo aplicar el tamaño máximo si es mayor que el actual
            if (titleFontSize > maxFontSize) {
              clonedTitle.style.fontSize = `${maxFontSize}px`;
            }

            appBarTitle.appendChild(clonedTitle);
          } else if (cloneMode === CloneMode.INNER_HTML) {
            // Copiamos solo el innerHTML
            appBarTitle.innerHTML = title.innerHTML;

            // Solo aplicar el tamaño máximo si es mayor que el actual
            if (titleFontSize > maxFontSize) {
              appBarTitle.style.fontSize = `${maxFontSize}px`;
            }
          } else if (cloneMode === CloneMode.TEXT_CONTENT) {
            // Copiamos solo el textContent
            appBarTitle.textContent = title.textContent;

            // Solo aplicar el tamaño máximo si es mayor que el actual
            if (titleFontSize > maxFontSize) {
              appBarTitle.style.fontSize = `${maxFontSize}px`;
            }
          }

          appBarTitle.classList.add("opacity-100");
          appBarTitle.classList.remove("opacity-0");

          if (removeLeadingIcons) {
            leadingIcons.classList.add("opacity-0");
            leadingIcons.classList.remove("opacity-100");
          }
        }
      });
    },
    {
      rootMargin: `-${appBarHeight}px 0px 0px 0px`,
      threshold: 0,
    }
  );

  observer.observe(title);
};
