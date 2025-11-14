const GridLayout = ({ variation }) => {
  switch (variation) {
    case 1:
      return <GridVariationOne />;
    case 2:
      return <GridVariationTwo />;
    case 3:
      return <GridVariationThree />;
    case 4:
      return <GridVariationFour />;
    case 5:
      return <GridVariationFive />;
  }
};

const GridVariationOne = () => (
  <div class="grid">
    <div class="left">Large left</div>
    <div class="right">
      <div class="top">Top landscape</div>
      <div class="bottom">
        <div class="bottom-left">Quarter 1</div>
        <div class="bottom-right">Quarter 2</div>
      </div>
    </div>
  </div>
);
const GridVariationTwo = () => (
  <div class="grid">
    <div class="left">Large left</div>
    <div class="right">Large Right</div>
  </div>
);
const GridVariationThree = () => (
  <div class="grid">
    <div class="left">
      <div>Top Landscape</div>
      <div>Bottom Landscape</div>
    </div>
    <div class="right">Large Right</div>
  </div>
);
const GridVariationFour = () => (
  <div class="grid">
    <div class="left">
      <div>Top Landscape</div>
      <div>Hole</div>
    </div>
    <div class="right">
      <div class="top">
        <div class="bottom-left">Quarter 1</div>
        <div class="bottom-right">Quarter 2</div>
      </div>
      <div class="bottom">
        <div class="bottom-left">Quarter 1</div>
        <div class="bottom-right">Hole</div>
      </div>
    </div>
  </div>
);
const GridVariationFive = () => {};
