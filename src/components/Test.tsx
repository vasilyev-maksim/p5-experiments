import { useState } from "react";
import { ScrollShadow } from "./ScrollShadow";
import styles from "./Test.module.css";
import { Button } from "./Button";

export function Test() {
  const [height, setHeight] = useState(400);

  const inc = () => {
    setHeight((x) => x + 100);
  };
  const dec = () => {
    setHeight((x) => x - 100);
  };

  return (
    <>
      <ScrollShadow active style={{ height }} className={styles.Test}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam,
        atque, cupiditate quo placeat natus amet tempore modi facilis, eum
        aliquam corrupti ut facere a quos ipsam nemo dolor asperiores alias illo
        ad. Rem quae ducimus earum modi error aspernatur ex id laborum nemo
        adipisci et tempora optio quidem expedita, sed a distinctio ipsa velit
        impedit quaerat cum dolorum. Excepturi adipisci minus quod numquam quasi
        atque illo nihil repellat dolorum modi totam aspernatur iste voluptatum
        ipsum temporibus, earum libero molestiae odio. Repudiandae nisi
        molestias eveniet, minima pariatur facilis aliquam sed eum. Esse,
        voluptates nihil. Praesentium quisquam ipsam maxime laudantium natus
        magnam explicabo dolore sed, suscipit culpa eligendi, quibusdam
        architecto porro fugit iusto asperiores temporibus eum est quae id
        adipisci animi perspiciatis dolorem consectetur. Iure nulla, expedita
        molestiae numquam sint possimus aspernatur. Consectetur eveniet minus
        officiis eaque, quaerat ducimus praesentium architecto dolorum eos
        nostrum corrupti impedit, sequi quibusdam consequatur vero suscipit
        placeat exercitationem explicabo. Quae dignissimos pariatur corporis
        nemo sapiente maxime saepe quas earum modi voluptatum excepturi eveniet,
        adipisci perferendis accusamus amet? Molestias vel, modi animi aliquid
        explicabo ipsa iste quam natus hic laudantium accusantium nulla
        cupiditate dolorum facere beatae delectus ratione optio voluptates
        nostrum, aperiam fugit illo! Minima, commodi eaque.
      </ScrollShadow>
      <Button label="+100" onClick={inc} />
      &nbsp;
      <Button label="-100" onClick={dec} />
    </>
  );
}
