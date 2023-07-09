import * as graphlib from "graphlib";

export interface RelationshipAnalyzer {
  parse(script: string): RelationshipGraph;
  getMutualFriend(name1: string, name2: string): string[];
}

export interface RelationshipGraph {
  hasConnection(name1: string, name2: string): boolean;
}

export class RelationshipAnalyzerAdapter implements RelationshipAnalyzer {
  private analyzer: SuperRelationshipAnalyzer;
  private graph: RelationshipGraphAdapter;
  private user: string[] = [];
  constructor() {
    this.analyzer = new SuperRelationshipAnalyzer();
    this.graph = new RelationshipGraphAdapter();
  }

  public parse(script: string): RelationshipGraph {
    const analyzer_init_data: string[] = [];

    script.split("\r\n").forEach((relationship) => {
      const [target, friends] = relationship.split(":");
      friends
        .trim()
        .split(" ")
        .forEach((friend) => {
          analyzer_init_data.push(`${target} -- ${friend}`);
          this.graph.setEdge(target, friend);
        });
      this.user.push(target);
    });

    this.analyzer.init(analyzer_init_data.join("\r\n"));
    return this.graph;
  }

  public getMutualFriend(name1: string, name2: string): string[] {
    const mutual_friend: string[] = [];
    const target = this.user.filter((user) => user !== name1 && user !== name2);
    target.forEach((target_name) => {
      if (this.analyzer.isMutualFriend(target_name, name1, name2)) {
        mutual_friend.push(target_name);
      }
    });

    return mutual_friend;
  }
}

export class SuperRelationshipAnalyzer {
  private friend_map: { [user: string]: string[] } = {};

  public init(script: string): void {
    script.split("\r\n").forEach((relationship) => {
      const [user_a, user_b] = relationship.split(" -- ");
      this.addFriend(user_a, user_b);
    });
  }

  public isMutualFriend(
    targetName: string,
    name1: string,
    name2: string
  ): boolean {
    this.friend_map[name1];
    if (this.isFriend(name1, targetName) && this.isFriend(name2, targetName)) {
      return true;
    }
    return false;
  }

  private addFriend(user: string, friend: string) {
    const friends = this.friend_map[user] || [];
    friends.push(friend);
    this.friend_map[user] = friends;
    return;
  }

  private isFriend(user: string, target: string) {
    return this.friend_map[user].some((friend) => target === friend);
  }
}

export class RelationshipGraphAdapter implements RelationshipGraph {
  private graph = new graphlib.Graph({ directed: true });

  public setEdge(name1: string, name2: string) {
    this.graph.setEdge(name1, name2);
  }

  public hasConnection(name1: string, name2: string): boolean {
    const visited: { [node: string]: boolean } = {};
    return this.dfs(name1, name2, visited);
  }

  private dfs(
    node: string,
    targetNode: string,
    visited: { [node: string]: boolean }
  ): boolean {
    if (node === targetNode) {
      return true;
    }

    visited[node] = true;

    const successors = this.graph.successors(node) || [];
    for (const successor of successors) {
      if (!visited[successor] && this.dfs(successor, targetNode, visited)) {
        return true;
      }
    }

    return false;
  }
}
