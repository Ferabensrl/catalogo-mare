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
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Productos de prueba (simulando los datos del Excel)
  const productosData = [
    {
      id: 'PASH5016',
      nombre: 'Pashminas',
      categoria: 'textil',
      categoriaOriginal: 'Textil',
      precio: 245,
      medidas: '70 x 190cm',
      colores: ['Verde', 'Salmon', 'Mostaza'],
      imagenes: [
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-1.png',
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-2.png',
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/PASH5016-3.png'
      ],
      tieneColoresEspecificos: true
    },
    {
      id: 'LB233',
      nombre: 'Bolsos',
      categoria: 'marroquineria',
      categoriaOriginal: 'Marroquinería',
      precio: 790,
      medidas: '32 x 13 x 34cm',
      colores: ['Lila', 'Rosado', 'Bordeaux'],
      imagenes: [
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-1.png',
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/LB233-2.png'
      ],
      tieneColoresEspecificos: true
    },
    {
      id: '24002',
      nombre: 'Set caravanas',
      categoria: 'caravanas_acero',
      categoriaOriginal: 'Caravanas acero',
      precio: 79,
      medidas: '',
      colores: ['SURTIDO'],
      imagenes: [
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/imagenes/24002.jpg'
      ],
      tieneColoresEspecificos: false
    }
  ];

  const categoriasIniciales = [
    { id: 'todos', nombre: 'Todos los productos' },
    { id: 'textil', nombre: 'Textil' },
    { id: 'marroquineria', nombre: 'Marroquinería' },
    { id: 'caravanas_acero', nombre: 'Caravanas Acero' }
  ];

  // Función para cargar productos desde Excel
  const cargarProductosDesdeExcel = async () => {
    try {
      setCargando(true);
      setError('');
      
      console.log('🔄 Iniciando carga desde Excel...');
      
      // URLs corregidas basadas en tu GitHub
      const urlsExcel = [
        'https://raw.githubusercontent.com/Ferabensrl/catalogo-mare/main/datos/catalogo-mare.xlsx',
        'https://raw.githubusercontent.com/Ferabensrl/catalogo-mare/master/datos/catalogo-mare.xlsx',
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@main/datos/catalogo-mare.xlsx',
        'https://cdn.jsdelivr.net/gh/Ferabensrl/catalogo-mare@master/datos/catalogo-mare.xlsx',
        'https://github.com/Ferabensrl/catalogo-mare/raw/main/datos/catalogo-mare.xlsx',
        'https://github.com/Ferabensrl/catalogo-mare/raw/master/datos/catalogo-mare.xlsx'
      ];
      
      let response;
      let urlExitosa = '';
      
      for (const url of urlsExcel) {
        try {
          console.log('🌐 Probando URL:', url);
          response = await fetch(url);
          
          if (response.ok) {
            urlExitosa = url;
            console.log('✅ URL exitosa:', url);
            break;
          } else {
            console.log('❌ Falló:', url, '- Status:', response.status);
          }
        } catch (error) {
          console.log('❌ Error con:', url, '- Error:', error.message);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error('No se pudo acceder al Excel desde GitHub. Usando productos de demostración.');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('✅ Excel descargado desde:', urlExitosa, '- Tamaño:', arrayBuffer.byteLength, 'bytes');
      
      // Procesar Excel
      const XLSX = await import('https://cdn.skypack.dev/xlsx');
      const workbook = XLSX.read(arrayBuffer);
      
      if (!workbook.SheetNames.includes('Catalogo_Actual')) {
        throw new Error('No se encontró la hoja "Catalogo_Actual"');
      }
      
      const worksheet = workbook.Sheets['Catalogo_Actual'];
      const productosExcel = XLSX.utils.sheet_to_json(worksheet);
      
      // Procesar datos
      const columnasOperativas = [
        'Código', 'Nombre', 'Descripción', 'Categoría', 'Precio', 'Medidas',
        'Imagen 1', 'Imagen 2', 'Imagen 3', 'Imagen 4', 'Imagen 5', 'Imagen 6', 
        'Imagen 7', 'Imagen 8', 'Imagen 9', 'Imagen 10', 'Imagen Variantes',
        'Imagen 1 URL', 'Imagen 2 URL', 'Imagen 3 URL', 'Imagen 4 URL', 'Imagen 5 URL',
        'Imagen 6 URL', 'Imagen 7 URL', 'Imagen 8 URL', 'Imagen 9 URL', 'Imagen 10 URL', 'Imagen Variantes URL'
      ];
      
      const todasLasColumnas = Object.keys(productosExcel[0]);
      const columnasColores = todasLasColumnas.filter(col => !columnasOperativas.includes(col));
      
      const productosFormateados = productosExcel.map(producto => {
        if (!producto.Código || !producto.Nombre || !producto.Precio) return null;
        
        const coloresDisponibles = columnasColores.filter(color => producto[color] === 'SI');
        const colores = coloresDisponibles.length > 0 ? coloresDisponibles : ['SURTIDO'];
        
        const imagenes = [];
        for (let i = 1; i <= 10; i++) {
          const urlImagen = producto[`Imagen ${i} URL`];
          if (urlImagen && urlImagen.trim()) {
            imagenes.push(urlImagen);
          }
        }
        
        return {
          id: producto.Código,
          nombre: producto.Nombre,
          categoria: (producto.Categoría || 'General').toLowerCase().replace(/\s+/g, '_'),
          categoriaOriginal: producto.Categoría || 'General',
          precio: producto.Precio || 0,
          medidas: producto.Medidas || '',
          colores: colores,
          imagenes: imagenes.length > 0 ? imagenes : ['https://via.placeholder.com/300x300/8F6A50/E3D4C1?text=' + producto.Código],
          tieneColoresEspecificos: coloresDisponibles.length > 0
        };
      }).filter(producto => producto !== null);
      
      // Generar categorías
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
      
      console.log('✅ Productos cargados desde Excel:', productosFormateados.length);
      console.log('✅ Colores detectados:', columnasColores);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      setError(error.message);
      
      // Usar productos de demostración
      setProductos(productosData);
      setCategorias(categoriasIniciales);
      setCargando(false);
      
      console.log('🔄 Usando productos de demostración');
    }
  };

  useEffect(() => {
    // Intentar cargar desde Excel al iniciar
    cargarProductosDesdeExcel();
  }, []);

  const actualizarComentarioProducto = (productoId, comentario) => {
    setComentariosProducto(prev => ({
      ...prev,
      [productoId]: comentario
    }));
  };

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
    
    itemsCarrito.forEach(item => {
      mensaje += '- ' + item.producto.nombre + ' (' + item.producto.id + ')\n';
      mensaje += '  Color: ' + item.color + '\n';
      mensaje += '  Cantidad: ' + item.cantidad + '\n';
      mensaje += '  Precio unitario: $' + item.producto.precio + '\n';
      mensaje += '  Subtotal: $' + (item.producto.precio * item.cantidad) + '\n\n';
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
    setMostrarCarrito(false);
  };

  const cantidadItems = Object.values(carrito).reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E3D4C1' }}>
      {/* Header */}
      <div className="shadow-lg" style={{ backgroundColor: '#8F6A50' }}>
        <div className="text-center py-1 text-xs" style={{ backgroundColor: '#E3D4C1', color: '#8F6A50' }}>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <span>📞 097 998 999</span>
            <span>•</span>
            <span>By Feraben SRL</span>
            <span>•</span>
            <span>✉️ ferabensrl@gmail.com</span>
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
                title="Cargar desde Excel"
                disabled={cargando}
              >
                <RefreshCw size={16} className={cargando ? 'animate-spin' : ''} />
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

      {/* Search */}
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

      {/* Categories */}
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

      {/* Status */}
      <div className="px-4 pb-4">
        <div className={`border rounded-lg p-3 ${error ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
          <p className={`text-sm ${error ? 'text-yellow-700' : 'text-green-700'}`}>
            {error ? (
              <>🔄 <strong>Usando productos de demostración:</strong> {productos.length} productos • {error}</>
            ) : (
              <>✅ <strong>Productos cargados:</strong> {productos.length} productos • <button onClick={cargarProductosDesdeExcel} className="underline hover:no-underline">🔄 Cargar desde Excel</button></>
            )}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              {/* Image */}
              <div className="relative">
                <img
                  src={producto.imagenes[imagenesActivas[producto.id] || 0]}
                  alt={producto.nombre}
                  className="w-full h-28 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/8F6A50/E3D4C1?text=' + producto.id;
                  }}
                />
                
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  ✅ OK
                </div>
                
                {/* Image navigation */}
                {producto.imagenes.length > 1 && (
                  <>
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
                    
                    {producto.imagenes.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {(imagenesActivas[producto.id] || 0) + 1}/{producto.imagenes.length}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Content */}
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
                    {producto.tieneColoresEspecificos ? 'Colores disponibles:' : 'Producto único:'}
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
                        style={{ 
                          backgroundColor: color === 'SURTIDO' ? '#8F6A50' : '#E3D4C1', 
                          color: color === 'SURTIDO' ? 'white' : '#8F6A50',
                          border: '1px solid #8F6A50'
                        }}
                      >
                        + {color}
                      </button>
                    ))}
                  </div>
                  
                  {/* Cart items for this product */}
                  {Object.entries(carrito).some(([key]) => key.startsWith(producto.id)) && (
                    <div className="mt-3 p-3 rounded border-2" style={{ backgroundColor: '#E3D4C1', borderColor: '#8F6A50' }}>
                      <p className="text-sm font-bold mb-2" style={{ color: '#8F6A50' }}>
                        🛒 En tu carrito:
                      </p>
                      {Object.entries(carrito)
                        .filter(([key]) => key.startsWith(producto.id))
                        .map(([key, item]) => (
                          <div key={key} className="flex items-center justify-between mb-2 p-2 bg-white rounded">
                            <span className="text-sm font-medium" style={{ color: '#8F6A50' }}>
                              {item.color}: {item.cantidad} unidades
                            </span>
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

      {/* Cart Modal */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full w-full flex flex-col bg-white">
            <div className="bg-white border-b p-4 shadow-sm" style={{ borderColor: '#8F6A50' }}>
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
                <div className="space-y-3">
                  {Object.entries(carrito).map(([key, item]) => (
                    <div key={key} className="p-3 rounded-lg border" style={{ backgroundColor: '#E3D4C1', borderColor: '#8F6A50' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold" style={{ color: '#8F6A50' }}>
                            {item.producto.nombre} ({item.producto.id})
                          </h4>
                          <p className="text-sm" style={{ color: '#8F6A50' }}>
                            🎨 {item.color} • 💰 ${item.producto.precio} c/u
                          </p>
                        </div>
                        <button
                          onClick={() => eliminarDelCarrito(key)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => actualizarCantidad(key, item.cantidad - 1)}
                          className="p-1 bg-white rounded hover:bg-gray-100"
                        >
                          <Minus size={16} style={{ color: '#8F6A50' }} />
                        </button>
                        
                        <span className="px-3 py-1 bg-white rounded font-bold" style={{ color: '#8F6A50' }}>
                          {item.cantidad}
                        </span>
                        
                        <button
                          onClick={() => actualizarCantidad(key, item.cantidad + 1)}
                          className="p-1 bg-white rounded hover:bg-gray-100"
                        >
                          <Plus size={16} style={{ color: '#8F6A50' }} />
                        </button>
                        
                        <div className="flex-1 text-right">
                          <span className="font-bold" style={{ color: '#8F6A50' }}>
                            ${item.producto.precio * item.cantidad}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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