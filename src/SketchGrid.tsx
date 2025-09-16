import type { ISketch } from "./models";
import styles from "./SketchGrid.module.css";

export function SketchGrid(props: { items: ISketch[] }) {
  return (
    <div className={styles.Root}>
      {props.items.map((x, i) => (
        <Item key={x.id} item={x} animationDelay={700 + 200 * i} />
      ))}
    </div>
  );
}

export function Item({
  item,
  animationDelay,
}: {
  item: ISketch;
  animationDelay: number;
}) {
  return (
    <div
      className={styles.Item}
      style={{ animationDelay: animationDelay + "ms" }}
    >
      <img src={item.img} />
      <h2>{item.name}</h2>
    </div>
  );
}
