export type TFiles = {
    name: string;
    children?: TFiles[]
}
  
  export const files: TFiles = {
    name: "root",
    children: [
      {
        name: "node_modules",
        children: [
          {
            name: ".bin"
          },
          {
            name: ".cache"
          },
          {
            name: "folder",
            children: [
                {
                    name: "child",
                }
            ]
          },
          {
            name: "test.zip"
          },
          {
            name: "test.fasta"
          }
        ]
      },
      {
        name: "public",
        children: [
          {
            name: "index.html"
          },
          {
            name: "robots.tsx"
          }
        ]
      },
      {
        name: "src",
        children: [
          {
            name: "components",
          },
        ]
      }
    ]
  }