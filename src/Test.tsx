function App() {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          height: 262,
          width: 262,
          backgroundImage: `url('./lungs.png')`,
          backgroundSize: `100% 100%`,
          // backgroundPosition: "50%",
        }}
      ></div>
      <div
        style={{
          height: 262, //269
          width: 262,
          backgroundImage: `url('./lungs_full.png')`,
          // backgroundSize: `100% 100%`,
          backgroundSize: (1720 * 100) / 524 + "%",
          backgroundPosition: "50% 50%",
        }}
      ></div>
    </div>
  );
}

export default App;
