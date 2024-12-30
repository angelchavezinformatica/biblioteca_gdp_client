import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import type { BookI, Copy, PaginatedI } from "~/types";

export interface Props {
  loading: globalThis.Ref<boolean, boolean>;
  rows: globalThis.Ref<BookI[] | undefined, BookI[] | undefined>;
}

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título" },
  { key: "pages", label: "Páginas" },
  { key: "author", label: "Autor" },
  { key: "category", label: "Categoría" },
  { key: "subcategory", label: "Subcategoría" },
  { key: "actions", label: "Acciones" },
];

export function useCatalogTable(props: Props) {
  const { data } = useAuthStore();

  const reservationModal = ref(false);
  const selectedItem = ref<BookI>();
  const copies = ref<unknown[]>([]);
  const copiesLoading = ref(false);
  const reservationButtonLoading = ref<boolean>(false);

  const selectedCopy = ref<string>();
  const selectedCopiesId = ref<number[]>();

  const isValidData = computed(() => {
    return Boolean(selectedCopy.value);
  });

  const handleReservation = async () => {
    reservationButtonLoading.value = true;

    console.log(selectedCopy.value);

    reservationButtonLoading.value = false;
  };

  const handleSelectRow = async (row: BookI) => {
    selectedItem.value = row;
    reservationModal.value = true;
    copiesLoading.value = true;
    selectedCopy.value = undefined;
    copies.value = [];

    const response = await axios.get<PaginatedI<Copy>>(
      `${BACKEND_SERVER}/copy/${row.id}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) {
      response.data.data.forEach((copy) => {
        copies.value.push({
          name: `Código: ${copy.code} - Condición: ${
            copy.condition === "NEW"
              ? "Nuevo"
              : copy.condition === "GOOD"
              ? "Bueno"
              : copy.condition === "FAIR"
              ? "Regular"
              : copy.condition === "DAMAGED"
              ? "Dañado"
              : "Malo"
          }`,
          value: copy.id,
        });
      });
    } else {
      copies.value = [];
    }

    copiesLoading.value = false;
  };

  const items = (row: BookI) => [
    [
      {
        label: "Reservar",
        icon: "i-mdi-calendar",
        click: () => handleSelectRow(row),
      },
    ],
  ];

  return {
    columns,
    rows: props.rows,
    loading: props.loading,
    reservationModal,
    reservationButtonLoading,
    selectedItem,
    copiesLoading,
    selectedCopy,
    copies,
    isValidData,
    selectedCopiesId,
    handleReservation,
    items,
  };
}
