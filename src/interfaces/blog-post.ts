import type { EntryFieldTypes, EntrySkeletonType } from "contentful";

export interface BlogPost {
  contentTypeId: "blogPost";
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    featuredImage: EntryFieldTypes.Object<EntrySkeletonType>;
    summary: EntryFieldTypes.Text;
    shortTitle?: EntryFieldTypes.Text;
    contentMarkdown?: EntryFieldTypes.Text;
    contentHtml?: EntryFieldTypes.RichText;
    publishDate: EntryFieldTypes.Date;
    readingTime: EntryFieldTypes.Number;
  };
}
