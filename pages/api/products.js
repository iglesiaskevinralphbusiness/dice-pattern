export default (req, res) => {
  res.status(200).json([
    {
      "id": "1",
      "title": "Product 1"
    },
    {
      "id": "2",
      "title": "Product 2"
    },
    {
      "id": "3",
      "title": "Product 3"
    }
  ]);
}