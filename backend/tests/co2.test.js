function calculateCO2(consumption) {
  return (Number(consumption) * 0.5).toFixed(2);
}

test("calculates CO2 correctly for 100 kWh", () => {
  expect(calculateCO2(100)).toBe("50.00");
});

test("calculates CO2 correctly for 0 kWh", () => {
  expect(calculateCO2(0)).toBe("0.00");
});

test("calculates CO2 correctly for 80 kWh", () => {
  expect(calculateCO2(80)).toBe("40.00");
});
