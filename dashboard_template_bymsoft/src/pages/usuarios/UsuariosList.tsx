import { useEffect, useState } from "react";
import { obtenerUsuarios, Usuario } from "../../api/userApi";
import { Search, UserPlus } from "lucide-react";
import { Loading } from "../../components/common/Loading";

export const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerUsuarios()
      .then(setUsuarios)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Cargando usuarios..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md">
          <UserPlus className="w-5 h-5" /> Nuevo usuario
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          className="border rounded-md px-3 py-2 w-full"
          placeholder="Buscar por nombre o email"
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuarios.map((u) => (
          <div key={u.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{u.nombre}</h3>
            <p className="text-sm text-gray-600">{u.email}</p>
            {u.rol && <p className="text-sm text-gray-600">Rol: {u.rol}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
