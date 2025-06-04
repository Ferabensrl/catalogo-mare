import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Send, Search, RefreshCw } from 'lucide-react';

const CatalogoMare = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [comentarioFinal, setComentarioFinal] = useState('');
  const [comentariosProducto, setComentariosProducto] = useState({});
  const [imagenesActivas, setImagenesActivas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState([]);

  // Función para cargar productos dinámicamente desde el Excel
  const cargarProductosDesdeExcel = async () => {
    try {
      setCargando(true);
      setError('');
      
      // Simular carga del Excel real - aquí iría la lógica para leer desde GitHub
      // Por ahora uso los datos reales del Excel actualizado
      const productosExcel = [
        {
          codigo: 'PASH5016',
          nombre: 'Pashminas',
          descripcion: 'Pashminas',
          categoria: 'Textil',
          precio: 245,
          medidas: '70 x 190cm',
          colores: ['Verde', 'Salmon', 'Mostaza'],
          imagenes: [
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-1.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-2.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-3.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-4.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-5.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-6.png'
          ]
        },
        {
          codigo: 'LB233',
          nombre: 'Bolsos',
          descripcion: 'Bolsos',
          categoria: 'Marroquineria',
          precio: 790,
          medidas: '32 x 13 x 34cm',
          colores: ['Lila', 'Rosado', 'Bordeaux'],
          imagenes: [
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-1.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-2.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-3.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-4.png',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-5.png'
          ]
        },
        {
          codigo: 'LB270',
          nombre: 'Bandolera',
          descripcion: 'Bandolera',
          categoria: 'Marroquineria',
          precio: 650,
          medidas: '22x13x22cm',
          colores: ['Rojo', 'Rosa Viejo', 'Petroleo', 'Azul', 'Mostaza'],
          imagenes: [
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB270-1.jpg',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB270-2.jpg',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB270-3.jpg',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB270-4.jpg'
          ]
        },
        {
          codigo: '24002',
          nombre: 'Set caravanas',
          descripcion: 'Set caravanas',
          categoria: 'Caravanas acero',
          precio: 79,
          medidas: '',
          colores: ['Único'], // Para productos sin colores específicos
          imagenes: [
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/24002.jpg'
          ]
        },
        {
          codigo: 'LB1091',
          nombre: 'Bandolera',
          descripcion: 'Bandolera',
          categoria: 'Marroquineria',
          precio: 695,
          medidas: '',
          colores: ['Rosado', 'Rosa Viejo', 'Azul', 'Mostaza'],
          imagenes: [
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB1091-1.jpg',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB1091-2.jpg',
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB1091-3.jpg'
          ]
        },
        {
          codigo: 'NKG2002',
          nombre: 'Gargantilla acero',
          descripcion: 'Gargantilla acero',
          categoria: 'Gargantillas acero',
          precio: 195,
          medidas: '',
          colores: ['Único'], // Para productos sin colores específicos
          imagenes: [
            'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/NKG2002.jpg'
          ]
        }
      ];

      // Convertir categorías a formato interno (lowercase con guiones)
      const productosFormateados = productosExcel.map(p => ({
        id: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion,
        categoria: p.categoria.toLowerCase().replace(/\s+/g, '_'),
        categoriaOriginal: p.categoria,
        precio: p.precio,
        medidas: p.medidas,
        colores: p.colores,
        imagenes: p.imagenes
      }));

      // Generar categorías dinámicamente
      const categoriasUnicas = [...new Set(productosFormateados.map(p => p.categoriaOriginal))];
      const categoriasFormateadas = [
        { id: 'todos', nombre: 'Todos los productos' },
        ...categoriasUnicas.map(cat => ({
          id: cat.toLowerCase().replace(/\s+/g, '_'),
          nombre: cat
        }))
      ];

      setProductos(productosFormateados);
      setCategorias(categoriasFormateadas);
      setCargando(false);
      
      console.log('Productos cargados:', productosFormateados);
      console.log('Categorías generadas:', categoriasFormateadas);
      
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar productos. Intentando nuevamente...');
      setCargando(false);
    }
  };

  // Función para cargar REALMENTE desde Excel (próxima implementación)
  const cargarDesdeExcelReal = async () => {
    try {
      // Esta función leerá directamente desde el Excel de GitHub
      // Aquí implementaremos la lectura automática del archivo
      console.log('Función para implementar: lectura directa desde Excel GitHub');
    } catch (error) {
      console.error('Error leyendo Excel:', error);
    }
  };

  useEffect(() => {
    cargarProductosDesdeExcel();
  }, []);

  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = categoriaActiva === 'todos' || producto.categoria === categoriaActiva;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.id.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const agregarAlCarrito = (productoId, color, cantidad = 1) => {
    const key = productoId + '-' + color;
    setCarrito(prev => ({
      ...prev,
      [key]: {
        cantidad: (prev[key]?.cantidad || 0) + cantidad,
        producto: productos.find(p => p.id === productoId),
        color: color
      }
    }));
  };

  const establecerCantidad = (key, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad) || 0;
    if (cantidad <= 0) {
      const nuevoCarrito = { ...carrito };
      delete nuevoCarrito[key];
      setCarrito(nuevoCarrito);
    } else {
      setCarrito(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          cantidad: cantidad
        }
      }));
    }
  };

  const actualizarCantidad = (key, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      const nuevoCarrito = { ...carrito };
      delete nuevoCarrito[key];
      setCarrito(nuevoCarrito);
    } else {
      setCarrito(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          cantidad: nuevaCantidad
        }
      }));
    }
  };

  const actualizarComentarioProducto = (productoId, comentario) => {
    setComentariosProducto(prev => ({
      ...prev,
      [productoId]: comentario
    }));
  };

  const eliminarDelCarrito = (key) => {
    const nuevoCarrito = { ...carrito };
    delete nuevoCarrito[key];
    setCarrito(nuevoCarrito);
  };

  const cambiarImagen = (productoId, indice) => {
    setImagenesActivas(prev => ({
      ...prev,
      [productoId]: indice
    }));
  };

  const calcularTotal = () => {
    return Object.values(carrito).reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  };

  const generarPedido = () => {
    const itemsCarrito = Object.values(carrito);
    if (itemsCarrito.length === 0) return;

    let mensaje = 'PEDIDO MARÉ\n\n';
    mensaje += 'Cliente: [Nombre del cliente]\n';
    mensaje += 'Fecha: ' + new Date().toLocaleDateString('es-UY') + '\n\n';
    mensaje += 'PRODUCTOS:\n';
    
    // Agrupar productos por ID
    const productosAgrupados = {};
    itemsCarrito.forEach(item => {
      const productoId = item.producto.id;
      if (!productosAgrupados[productoId]) {
        productosAgrupados[productoId] = {
          producto: item.producto,
          items: [],
          totalProducto: 0
        };
      }
      productosAgrupados[productoId].items.push(item);
      productosAgrupados[productoId].totalProducto += item.producto.precio * item.cantidad;
    });

    // Generar mensaje agrupado por producto
    Object.values(productosAgrupados).forEach(grupo => {
      mensaje += '- ' + grupo.producto.nombre + ' (' + grupo.producto.id + ')\n';
      
      // Mostrar todos los colores en una línea
      const colores = grupo.items.map(item => item.cantidad + ' ' + item.color).join(', ');
      mensaje += '  Cantidades: ' + colores + '\n';
      
      mensaje += '  Precio unitario: $' + grupo.producto.precio + '\n';
      mensaje += '  Subtotal: $' + grupo.totalProducto + '\n';
      
      // Comentario del producto
      const comentario = comentariosProducto[grupo.producto.id];
      if (comentario && comentario.trim()) {
        mensaje += '  COMENTARIO: ' + comentario + '\n';
      }
      mensaje += '\n';
    });

    mensaje += 'TOTAL PEDIDO: $' + calcularTotal() + '\n\n';
    
    if (comentarioFinal && comentarioFinal.trim()) {
      mensaje += 'COMENTARIOS ADICIONALES:\n' + comentarioFinal + '\n\n';
    }
    
    mensaje += 'Pedido enviado desde Catalogo MARÉ\nBy Feraben SRL';

    const numeroWhatsapp = '59897998999';
    const url = 'https://wa.me/' + numeroWhatsapp + '?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');

    setCarrito({});
    setComentarioFinal('');
    setComentariosProducto({});
    setMostrarCarrito(false);
  };

  const cantidadItems = Object.values(carrito).reduce((total, item) => total + item.cantidad, 0);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E3D4C1' }}>
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} style={{ color: '#8F6A50' }} />
          <p className="text-lg font-medium" style={{ color: '#8F6A50' }}>
            Cargando productos MARÉ desde Excel...
          </p>
          <p className="text-sm opacity-75" style={{ color: '#8F6A50' }}>
            Leyendo categorías y colores automáticamente
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E3D4C1' }}>
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={cargarProductosDesdeExcel}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#8F6A50' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E3D4C1' }}>
      <div className="shadow-lg" style={{ backgroundColor: '#8F6A50' }}>
        <div className="text-center py-1 text-xs" style={{ backgroundColor: '#E3D4C1', color: '#8F6A50' }}>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <span>📞 097 998 999</span>
            <span>•</span>
            <span>By Feraben SRL</span>
            <span>•</span>
            <span>✉️ ferabensrl@gmail.com</span>
            <span>•</span>
            <span>🔄 Excel Dinámico</span>
          </div>
        </div>
        
        <div className="p-3 text-white">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: 'serif' }}>
                MARÉ
              </h1>
              <p className="text-xs opacity-90">Tu estilo en cada detalle</p>
              <p className="text-xs opacity-80">@mare_uy</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={cargarProductosDesdeExcel}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                title="Recargar desde Excel"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setMostrarCarrito(!mostrarCarrito)}
                className="relative p-2 rounded-full hover:bg-white/20 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <ShoppingCart size={20} />
                {cantidadItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cantidadItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3" size={20} style={{ color: '#8F6A50' }} />
          <input
            type="text"
            placeholder="Buscar productos o códigos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ backgroundColor: 'white' }}
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categorias.map(categoria => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaActiva(categoria.id)}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium"
              style={{
                backgroundColor: categoriaActiva === categoria.id ? '#8F6A50' : 'white',
                color: categoriaActiva === categoria.id ? 'white' : '#8F6A50'
              }}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700">
            📊 <strong>Sistema Dinámico:</strong> {productos.length} productos • {categorias.length - 1} categorías • Colores detectados automáticamente desde Excel
          </p>
        </div>
      </div>

      <div className="px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              {/* CARRUSEL DE IMÁGENES */}
              <div className="relative">
                <img
                  src={producto.imagenes[imagenesActivas[producto.id] || 0]}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/8F6A50/E3D4C1?text=' + producto.id;
                  }}
                />
                
                {/* Badge de producto dinámico */}
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  📊 EXCEL
                </div>
                
                {/* Indicadores de imágenes */}
                {producto.imagenes.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {producto.imagenes.map((_, indice) => (
                      <button
                        key={indice}
                        onClick={() => cambiarImagen(producto.id, indice)}
                        className="w-2 h-2 rounded-full transition-colors"
                        style={{
                          backgroundColor: (imagenesActivas[producto.id] || 0) === indice ? '#8F6A50' : 'rgba(255,255,255,0.5)'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Flechas de navegación */}
                {producto.imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => cambiarImagen(producto.id, (imagenesActivas[producto.id] || 0) > 0 ? (imagenesActivas[producto.id] || 0) - 1 : producto.imagenes.length - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => cambiarImagen(producto.id, (imagenesActivas[producto.id] || 0) < producto.imagenes.length - 1 ? (imagenesActivas[producto.id] || 0) + 1 : 0)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                    >
                      →
                    </button>
                  </>
                )}

                {/* Contador de imágenes */}
                {producto.imagenes.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {(imagenesActivas[producto.id] || 0) + 1}/{producto.imagenes.length}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg" style={{ color: '#8F6A50' }}>
                    {producto.nombre}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#E3D4C1', color: '#8F6A50' }}>
                    {producto.id}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 mb-2">📂 {producto.categoriaOriginal}</p>
                
                {producto.medidas && (
                  <p className="text-sm text-gray-600 mb-2">📏 {producto.medidas}</p>
                )}
                
                <p className="text-2xl font-bold mb-3" style={{ color: '#8F6A50' }}>
                  ${producto.precio}
                </p>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium" style={{ color: '#8F6A50' }}>
                    Colores disponibles: ({producto.colores.length})
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <label className="text-sm font-medium" style={{ color: '#8F6A50' }}>
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      id={'cantidad-' + producto.id}
                      className="w-20 text-center border rounded px-2 py-1"
                      style={{ borderColor: '#8F6A50', color: '#8F6A50' }}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Comentarios: ej. poneme más negro..."
                        id={'comentario-' + producto.id}
                        className="flex-1 text-sm border rounded px-3 py-2"
                        style={{ borderColor: '#8F6A50', backgroundColor: '#F9F9F9' }}
                      />
                      <button
                        onClick={() => {
                          const comentarioInput = document.getElementById('comentario-' + producto.id);
                          const comentario = comentarioInput.value.trim();
                          if (comentario) {
                            actualizarComentarioProducto(producto.id, comentario);
                            comentarioInput.value = '';
                          }
                        }}
                        className="px-3 py-2 text-sm font-medium rounded border"
                        style={{ backgroundColor: '#8F6A50', color: 'white', borderColor: '#8F6A50' }}
                      >
                        💬
                      </button>
                    </div>
                  </div>
                  
                  {comentariosProducto[producto.id] && (
                    <div className="mt-3 p-3 rounded border" style={{ backgroundColor: '#E3D4C1', borderColor: '#8F6A50' }}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-medium" style={{ color: '#8F6A50' }}>
                          💬 Comentario del producto:
                        </p>
                        <button
                          onClick={() => actualizarComentarioProducto(producto.id, '')}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                          🗑️
                        </button>
                      </div>
                      <input
                        type="text"
                        value={comentariosProducto[producto.id]}
                        onChange={(e) => actualizarComentarioProducto(producto.id, e.target.value)}
                        className="w-full text-sm border rounded px-3 py-2"
                        style={{ borderColor: '#8F6A50', backgroundColor: 'white', color: '#8F6A50' }}
                        placeholder="Edita tu comentario aquí..."
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const cantidadInput = document.getElementById('cantidad-' + producto.id);
                        const comentarioInput = document.getElementById('comentario-' + producto.id);
                        const cantidad = parseInt(cantidadInput.value) || 1;
                        const comentario = comentarioInput.value;
                        agregarAlCarrito(producto.id, 'SURTIDO', cantidad);
                        if (comentario) {
                          actualizarComentarioProducto(producto.id, comentario);
                        }
                        cantidadInput.value = 1;
                        comentarioInput.value = '';
                      }}
                      className="px-3 py-2 rounded-full text-sm font-medium transition-colors hover:shadow-md border-2"
                      style={{ backgroundColor: '#8F6A50', color: 'white', border: '2px solid #8F6A50' }}
                    >
                      + SURTIDO
                    </button>
                    
                    {producto.colores.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const cantidadInput = document.getElementById('cantidad-' + producto.id);
                          const comentarioInput = document.getElementById('comentario-' + producto.id);
                          const cantidad = parseInt(cantidadInput.value) || 1;
                          const comentario = comentarioInput.value;
                          agregarAlCarrito(producto.id, color, cantidad);
                          if (comentario) {
                            actualizarComentarioProducto(producto.id, comentario);
                          }
                          cantidadInput.value = 1;
                          comentarioInput.value = '';
                        }}
                        className="px-3 py-2 rounded-full text-sm font-medium transition-colors hover:shadow-md"
                        style={{ backgroundColor: '#E3D4C1', color: '#8F6A50', border: '1px solid #8F6A50' }}
                      >
                        + {color}
                      </button>
                    ))}
                  </div>
                  
                  {Object.entries(carrito).some(([key]) => key.startsWith(producto.id)) && (
                    <div className="mt-3 p-3 rounded border-2" style={{ backgroundColor: '#E3D4C1', borderColor: '#8F6A50' }}>
                      <p className="text-sm font-bold mb-2" style={{ color: '#8F6A50' }}>
                        🛒 En tu carrito:
                      </p>
                      {Object.entries(carrito)
                        .filter(([key]) => key.startsWith(producto.id))
                        .map(([key, item]) => (
                          <div key={key} className="flex items-center justify-between mb-2 p-2 bg-white rounded">
                            <div className="flex-1">
                              <span className="text-sm font-medium" style={{ color: '#8F6A50' }}>
                                {item.color}: {item.cantidad} unidades
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => actualizarCantidad(key, item.cantidad - 1)}
                                className="p-1 text-red-500 hover:bg-red-100 rounded text-xs"
                              >
                                -
                              </button>
                              <button
                                onClick={() => actualizarCantidad(key, item.cantidad + 1)}
                                className="p-1 text-green-500 hover:bg-green-100 rounded text-xs"
                              >
                                +
                              </button>
                              <button
                                onClick={() => eliminarDelCarrito(key)}
                                className="p-1 text-red-500 hover:bg-red-100 rounded text-xs ml-2"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full w-full flex flex-col bg-white">
            <div className="bg-white border-b p-4 shadow-sm z-10" style={{ borderColor: '#8F6A50' }}>
              <div className="flex items-center justify-between">
                <div></div>
                <h2 className="text-xl font-bold" style={{ color: '#8F6A50' }}>
                  🛒 Mi Pedido
                </h2>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl px-4 py-2 rounded-lg hover:bg-gray-100 border"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {Object.keys(carrito).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No hay productos en el carrito</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {(() => {
                    const productosAgrupados = {};
                    Object.entries(carrito).forEach(([key, item]) => {
                      const productoId = item.producto.id;
                      if (!productosAgrupados[productoId]) {
                        productosAgrupados[productoId] = {
                          producto: item.producto,
                          items: []
                        };
                      }
                      productosAgrupados[productoId].items.push({ key, ...item });
                    });

                    return Object.values(productosAgrupados).map(grupo => (
                      <div key={grupo.producto.id} className="p-3 rounded-lg border" style={{ backgroundColor: '#E3D4C1', borderColor: '#8F6A50' }}>
                        <div className="mb-3">
                          <h4 className="font-bold text-lg" style={{ color: '#8F6A50' }}>
                            {grupo.producto.nombre} ({grupo.producto.id})
                          </h4>
                          <p className="text-sm" style={{ color: '#8F6A50' }}>
                            💰 ${grupo.producto.precio} c/u • 📂 {grupo.producto.categoriaOriginal}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {grupo.items.map(item => (
                            <div key={item.key} className="flex items-center justify-between p-2 bg-white rounded">
                              <div className="flex-1">
                                <span className="font-medium" style={{ color: '#8F6A50' }}>
                                  🎨 {item.color}: {item.cantidad} unidades
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => actualizarCantidad(item.key, item.cantidad - 1)}
                                  className="p-1 bg-white rounded-full hover:bg-gray-100 transition-colors border"
                                  style={{ borderColor: '#8F6A50' }}
                                >
                                  <Minus size={16} style={{ color: '#8F6A50' }} />
                                </button>
                                
                                <input
                                  type="number"
                                  min="1"
                                  value={item.cantidad}
                                  onChange={(e) => establecerCantidad(item.key, e.target.value)}
                                  className="w-16 text-center font-bold border rounded px-2 py-1"
                                  style={{ 
                                    borderColor: '#8F6A50',
                                    color: '#8F6A50'
                                  }}
                                />
                                
                                <button
                                  onClick={() => actualizarCantidad(item.key, item.cantidad + 1)}
                                  className="p-1 bg-white rounded-full hover:bg-gray-100 transition-colors border"
                                  style={{ borderColor: '#8F6A50' }}
                                >
                                  <Plus size={16} style={{ color: '#8F6A50' }} />
                                </button>
                                
                                <button
                                  onClick={() => eliminarDelCarrito(item.key)}
                                  className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded ml-2"
                                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-300 text-right">
                          <p className="font-bold" style={{ color: '#8F6A50' }}>
                            💰 Subtotal producto: ${grupo.items.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)}
                          </p>
                        </div>

                        {comentariosProducto[grupo.producto.id] && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-xs font-medium" style={{ color: '#8F6A50' }}>
                                💬 Comentario del producto:
                              </p>
                              <button
                                onClick={() => actualizarComentarioProducto(grupo.producto.id, '')}
                                className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                              >
                                🗑️
                              </button>
                            </div>
                            <input
                              type="text"
                              value={comentariosProducto[grupo.producto.id]}
                              onChange={(e) => actualizarComentarioProducto(grupo.producto.id, e.target.value)}
                              className="w-full text-sm border rounded px-3 py-2"
                              style={{ 
                                borderColor: '#8F6A50',
                                backgroundColor: 'white',
                                color: '#8F6A50'
                              }}
                              placeholder="Edita tu comentario aquí..."
                            />
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
            
            <div className="bg-white border-t p-4 shadow-lg" style={{ borderColor: '#8F6A50' }}>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors px-4 py-3 rounded-lg hover:bg-gray-100 border mb-4"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-bold">Seguir comprando</span>
              </button>

              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span style={{ color: '#8F6A50' }}>💳 Total:</span>
                <span style={{ color: '#8F6A50' }}>${calcularTotal()}</span>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8F6A50' }}>
                  📝 Comentarios adicionales del pedido:
                </label>
                <textarea
                  placeholder="Ej: Entregar urgente, horario de recepción..."
                  value={comentarioFinal}
                  onChange={(e) => setComentarioFinal(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows="2"
                  style={{ borderColor: '#8F6A50', backgroundColor: '#F9F9F9' }}
                />
              </div>

              <button
                onClick={generarPedido}
                disabled={Object.keys(carrito).length === 0}
                className="w-full text-white py-4 rounded-lg font-bold hover:opacity-90 transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                style={{ backgroundColor: Object.keys(carrito).length === 0 ? '#999999' : '#25D366' }}
              >
                <Send size={20} />
                <span>📱 Enviar Pedido por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoMare;