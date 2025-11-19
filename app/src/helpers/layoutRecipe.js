export const layoutRecipe = (data) => {
  if (data?.length <= 2) return data?.map((item) => ({ size: "half", item: item }));
  if (data?.length <= 3)
    return [{ size: "half", item: data[0] }, ...data?.slice(1).map((item) => ({ size: "quarter", item }))];
  if (data?.length <= 4) {
    return [
      { size: "half", item: data[0] },
      { size: "quarter", item: data[1] },
      ...data?.slice(2, 4).map((item) => ({ size: "eigth", item })),
    ];
  }

  const lookUpSize = (item) => {
    switch (item.type) {
      case "visit":
        return "half";
      case "review":
        return "full";
      case "spot-on":
        return "half";
      case "person":
        return "eigth";
      case "portfolio":
        return item.satelliteImage.medium.width > item.satelliteImage.medium.height ? "quarter" : "eigth";
    }
  };

  return data?.map((item) => ({ size: lookUpSize(item), item: item })); // default layout
};
