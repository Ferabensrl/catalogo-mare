import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Producto = {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: string;
  colores: string[];
  imagenes: string[];
};

const productos: Producto[] = [
  {
    codigo: "24001",
    nombre: "Lente de sol Aurora",
    descripcion: "Lente con protección UV400 y estilo moderno.",
    precio: "$250",
    colores: ["Negro", "Marrón", "Transparente"],
    imagenes: [
      "https://raw.githubusercontent.com/Ferabensrl/catalogo-mare/main/imagenes/24001.jpg",
      "https://raw.githubusercontent.com/Ferabensrl/catalogo-mare/main/imagenes/24001_2.jpg",
    ],
  },
  {
    codigo: "24002",
    nombre: "Pashmina Étnica",
    descripcion: "Pashmina suave de diseño bohemio.",
    precio: "$180",
    colores: ["Rosa", "Verde", "Mostaza"],
    imagenes: [
      "https://raw.githubusercontent.com/Ferabensrl/catalogo-mare/main/imagenes/24002.jpg",
    ],
  },
  // Agregá más productos acá si querés
];

const CatalogoMare = () => {
  const [busqueda, setBusqueda] = useState("");
  const [pedido, setPedido] = useState<{ [codigo: string]: { color: string; cantidad: number } }>({});

  const agregarProducto = (codigo: string, color: string) => {
    setPedido((prev) => {
      const existente = prev[codigo];
      if (existente && existente.color === color) {
        return {
          ...prev,
          [codigo]: {
            ...existente,
            cantidad: existente.cantidad + 1,
          },
        };
      }
      return {
        ...prev,
        [codigo]: { color, cantidad: 1 },
      };
    });
  };

  const quitarProducto = (codigo: string) => {
    const nuevoPedido = { ...pedido };
    delete nuevoPedido[codigo];
    setPedido(nuevoPedido);
  };

  const generarMensajePedido = () => {
    let mensaje = "Hola, quiero hacer el siguiente pedido:\n\n";
    for (const [codigo, { color, cantidad }] of Object.entries(pedido)) {
      const producto = productos.find((p) => p.codigo === codigo);
      if (producto) {
        mensaje += `🛍️ *${producto.nombre}* (${codigo})\n- Color: ${color}\n- Cantidad: ${cantidad}\n\n`;
      }
    }
    const telefono = "59897998999"; // tu número sin el +
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.codigo.includes(busqueda)
  );

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-pink-800">Catálogo MARÉ</h1>
      <Input
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto) => (
          <Card key={producto.codigo}>
            <CardContent className="space-y-2 p-4">
              <CardTitle>{producto.nombre}</CardTitle>
              <p className="text-sm text-gray-500">{producto.descripcion}</p>
              <div className="flex space-x-2 overflow-x-auto">
                {producto.imagenes.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={producto.nombre}
                    className="h-28 w-28 rounded object-cover"
                  />
                ))}
              </div>
              <p className="font-semibold">{producto.precio}</p>
              <div className="flex flex-wrap gap-2">
                {producto.colores.map((color, idx) => (
                  <Badge
                    key={idx}
                    className="cursor-pointer hover:bg-pink-200"
                    onClick={() => agregarProducto(producto.codigo, color)}
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(pedido).length > 0 && (
        <div className="mt-6 p-4 border rounded shadow-sm bg-gray-50">
          <h2 className="text-xl font-bold mb-2">📝 Pedido</h2>
          {Object.entries(pedido).map(([codigo, { color, cantidad }]) => {
            const producto = productos.find((p) => p.codigo === codigo);
            return (
              <div key={codigo} className="flex justify-between items-center border-b py-1">
                <span>
                  {producto?.nombre} ({codigo}) - {color} x{cantidad}
                </span>
                <Button variant="outline" size="sm" onClick={() => quitarProducto(codigo)}>
                  Quitar
                </Button>
              </div>
            );
          })}
          <Button className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white" onClick={generarMensajePedido}>
            Enviar por WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogoMare;
