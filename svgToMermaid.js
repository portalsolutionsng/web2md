export function svgToMermaid(svgEl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgEl.outerHTML, "image/svg+xml");

  // --- helper to sanitize labels ---
  function sanitizeLabel(label) {
    if (!label) return "";
    // Escape double quotes inside label and wrap it in quotes
    return `"${label.replace(/"/g, '\\"')}"`;
  }

  // Collect nodes
  const nodes = {};
  doc.querySelectorAll("g.node").forEach(g => {
    const id = g.id?.replace(/^flowchart-/, "").split("-")[0];
    const text = g.querySelector("text")?.textContent.trim();
    if (id && text) {
      nodes[id] = { label: sanitizeLabel(text), cluster: null };
    }
  });

  // Collect clusters
  const clusters = {};
  doc.querySelectorAll("g.cluster").forEach((g, idx) => {
    const title = g.querySelector("title")?.textContent.trim() || `Cluster_${idx}`;
    clusters[title] = [];
    g.querySelectorAll("g.node").forEach(n => {
      const nodeId = n.id?.replace(/^flowchart-/, "").split("-")[0];
      if (nodeId && nodes[nodeId]) {
        nodes[nodeId].cluster = title;
        clusters[title].push(nodeId);
      }
    });
  });

  // Collect edges
  const edges = [];
  doc.querySelectorAll("path[id^='L_']").forEach(path => {
    const parts = path.id.split("_");
    if (parts.length >= 3) {
      const src = parts[1];
      const dst = parts[2];
      if (nodes[src] && nodes[dst]) {
        edges.push([src, dst]);
      }
    }
  });

  // Build Mermaid
  let mermaid = "```mermaid\nflowchart TD\n";

  // Add subgraphs first
  Object.entries(clusters).forEach(([clusterName, nodeIds], idx) => {
    mermaid += `    subgraph Cluster${idx}["${clusterName}"]\n`;
    nodeIds.forEach(nid => {
      mermaid += `        ${nid}[${nodes[nid].label}]\n`;
    });
    mermaid += "    end\n\n";
  });

  // Add standalone nodes (not in a cluster)
  Object.entries(nodes).forEach(([id, { label, cluster }]) => {
    if (!cluster) {
      mermaid += `    ${id}[${label}]\n`;
    }
  });

  // Add edges
  edges.forEach(([src, dst]) => {
    mermaid += `    ${src} --> ${dst}\n`;
  });

  mermaid += "```\n";
  return mermaid;
}