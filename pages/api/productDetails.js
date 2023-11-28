export default function handler(req, res) {
  const {method, query, body} = req;
  const { id } = query;

  switch(id){
    case 1:
    case "1":
      res.status(200).json({
        "id": "1",
        "title": "Product 1",
        "price": 100,
      });
      break;
    case 2:
    case "2":
      res.status(200).json({
        "id": "1",
        "title": "Product 2",
        "price": 200,
      });
      break;
    case 3:
    case "3":
      res.status(200).json({
        "id": "1",
        "title": "Product 3",
        "price": 300,
      });
      break;
    default:
      res.status(400).json({
        status: 400,
        error: "Product not found!"
      });
      break;
  }
}