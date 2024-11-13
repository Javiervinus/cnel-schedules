interface SiteConfig {
  author: string;
  title: string;
  description: string;
  lang: string;
  ogLocale: string;
}

export const siteConfig: SiteConfig = {
  author: "Javier Vinueza", // Site author
  title: "Horarios CNEL - Cortes de Luz Ecuador", // Site title.
  description:
    "Consulta los horarios actualizados de cortes de luz de CNEL en Ecuador. Mantente informado y planifica tu día con nuestro servicio en línea.", // Description to display in the meta tags
  lang: "es-EC",
  ogLocale: "es_EC",
};
