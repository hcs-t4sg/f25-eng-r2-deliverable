"use client";
import { useRef, useEffect } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis"; // D3 is a JavaScript library for data visualization: https://d3js.org/

// Example data: Only the first three rows are provided as an example
// Add more animals or change up the style as you desire

interface AnimalDatum  {
  name: string;
  speed: number;
  diet: "herbivore" | "omnivore" | "carnivore";
};

const animalData: AnimalDatum[] = [
  { name: "Cheetah", speed: 120, diet: "carnivore" },
  { name: "Pronghorn", speed: 98, diet: "herbivore" },
  { name: "Brown Bear", speed: 40, diet: "omnivore" },
  // Add more animals here!
];

export default function AnimalSpeedGraph() {
  // useRef creates a reference to the div where D3 will draw the chart.
  // https://react.dev/reference/react/useRef
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear any previous SVG to avoid duplicates when React hot-reloads
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
    }

    // Set up chart dimensions and margins
    const width = 500;
    const height = 300;
    const margin = { top: 70, right: 60, bottom: 80, left: 100 };

    // Create the SVG element where D3 will draw the chart
    // https://github.com/d3/d3-selection

    const svg  = select(graphRef.current!)
      .append<SVGSVGElement>("svg")
      .attr("width", width)
      .attr("height", height)


    // X scale: maps animal names to horizontal positions
    // https://github.com/d3/d3-scale#band-scales
    const x = scaleBand()
      .domain(animalData.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Y scale: maps speed values to vertical positions
    // https://github.com/d3/d3-scale#linear-scales
    const y = scaleLinear()
      .domain([0, max(animalData, (d) => d.speed)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Color scale: assigns a color to each diet type
    // https://github.com/d3/d3-scale#ordinal-scales
    const color = scaleOrdinal<string>()
      .domain(["herbivore", "omnivore", "carnivore"])
      .range(["#4ade80", "#facc15", "#f87171"]);

    // Draws the bars for each animal
    svg
      .selectAll("rect")
      .data(animalData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name)!)
      .attr("y", (d) => y(d.speed))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.speed))
      .attr("fill", (d) => color(d.diet))
      .attr("stroke", "#222");

    // Draws the X axis (animal names).
    // https://github.com/d3/d3-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(x))
      .call((g) =>
        g.selectAll("text")
          .attr("transform", "rotate(-30)")
          .attr("x", -5)
          .attr("y", 10)
          .style("text-anchor", "end")
          .style("fill", "#fff")
      )
      .call((g) =>
        g.selectAll("path, line")
          .style("stroke", "#fff")
      );


    // Draws the Y axis (speed values).
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(axisLeft(y))
      .call((g) =>
        g.selectAll("text")
          .style("fill", "#fff")
      )
      .call((g) =>
        g.selectAll("path, line")
          .style("stroke", "#fff")
      );


    // Adds X axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#fff")
      .text("Animal");

    // Adds Y axis label
    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 25) // Move further left
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#fff")
      .text("Speed (km/h)");

    // Draw a legend for the diet types.
    const legendItemHeight = 24;

    const legend = svg
      .selectAll<SVGGElement, string>(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (_d, i) =>
          `translate(${width - margin.right - 120},${margin.top + i * legendItemHeight - 10})`
      );

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d));

    legend
      .append("text")
      .attr("x", 26)
      .attr("y", 13)
      .attr("font-size", "14px")
      .attr("fill", "#fff")
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1));
  }, []);



  return (
    <section
      ref={graphRef}
      className="border rounded flex items-center justify-center"
    />
  );
}
