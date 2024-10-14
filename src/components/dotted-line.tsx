const DottedLine = () => {
  return (
    <span
      className="mx-2 flex-grow dark:invert"
      style={{
        height: "1px", // Set height for the dotted line
        backgroundImage: `url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3ccircle cx=\'1\' cy=\'1\' r=\'1\' fill=\'currentColor\'/%3e%3c/svg%3e")`,
        backgroundSize: "8px 1px", // Adjust the spacing of the dots
        backgroundRepeat: "repeat-x", // Repeat the background image horizontally
      }}
    />
  );
};

export default DottedLine;
