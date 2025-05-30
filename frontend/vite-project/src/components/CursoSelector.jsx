import { useState } from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const CursoSelector = ({ dataCurso, selectCurso, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCursos = dataCurso.filter((curso) =>
    curso.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6 space-y-2">
      <label htmlFor="buscar" className="block font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-rose-500" />
          <span>Buscar y seleccionar curso</span>
        </div>
      </label>
      <input
        type="text"
        id="buscar"
        placeholder="Escribe para buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-rose-500 focus:border-rose-500"
      />
      <select
        onChange={onChange}
        value={selectCurso}
        id="cursos"
        name="cursos"
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md shadow-sm"
      >
        <option value="">-- Selecciona un curso --</option>
        {filteredCursos.map((curso) => (
          <option key={curso.id} value={curso.id}>
            {curso.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CursoSelector;