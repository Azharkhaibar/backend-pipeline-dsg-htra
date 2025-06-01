import fs from "fs";
import path from "path";

export const staticHandler = (req: any, res: any): boolean => {
  const url = req.url || "";
  const staticPrefix = "/uploads/product/";
  if (url.startsWith(staticPrefix)) {
    const filePath = path.join(process.cwd(), url); // gunakan cwd agar path aman
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType =
        ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".png"
          ? "image/png"
          : "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return true;
    } else {
      res.writeHead(404);
      res.end("File not found");
      return true;
    }
  }
  return false;
};
