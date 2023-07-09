import * as fs from "fs-extra";
import { RelationshipAnalyzerAdapter } from "./analyzer";

const adapter = new RelationshipAnalyzerAdapter();
const relationship = fs.readFileSync("./src/relationship.txt", "utf-8");

const relationshi_graph = adapter.parse(relationship);
console.log(adapter.getMutualFriend("C", "B"));
console.log(relationshi_graph.hasConnection("A", "G"));
