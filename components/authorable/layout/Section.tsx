import { IComponents } from "@/.generated";
import { getCSLPAttributes } from "@/utils/type-guards";

export const Section = (props: IComponents['section']) => {
  return (
    <div>
      <h2>Section</h2>
      <h3 {...getCSLPAttributes(props.$?.title)}>{props.title}</h3>
      <p {...getCSLPAttributes(props.$?.description)}>{props.description}</p>
    </div>
  )
}
