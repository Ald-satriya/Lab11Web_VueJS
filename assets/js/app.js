const { createApp } = Vue;

const apiUrl = "http://localhost:8080/post";

createApp({
  data() {
    return {
      artikel: [],
      formData: {
        id: null,
        judul: "",
        isi: "",
        status: 0,
      },
      showForm: false,
      formTitle: "Tambah Artikel",
      statusOptions: [
        { text: "Draft", value: 0 },
        { text: "Publish", value: 1 },
      ],
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      axios
        .get(apiUrl)
        .then((response) => {
          this.artikel = response.data;
        })
        .catch((error) => console.error(error));
    },

    statusText(status) {
      return status == 1 ? "Publish" : "Draft";
    },

    tambah() {
      this.showForm = true;
      this.formTitle = "Tambah Artikel";
      this.formData = {
        id: null,
        judul: "",
        isi: "",
        status: 0,
      };
    },

    edit(data) {
      console.log("Edit artikel:", data); // Debug
      this.showForm = true;
      this.formTitle = "Edit Artikel";

      // Bind hanya properti yang digunakan
      this.formData = {
        id: data.id,
        judul: data.judul,
        isi: data.isi,
        status: 0, // atau data.status jika digunakan
      };
    },

    hapus(index, id) {
      console.log("Hapus artikel ID:", id); // Debug

      if (confirm("Yakin ingin menghapus artikel ini?")) {
        axios
          .delete(`${apiUrl}/${id}`)
          .then((response) => {
            console.log("Hapus sukses:", response.data); // Optional
            this.artikel.splice(index, 1);
          })
          .catch((error) => {
            console.error("Gagal menghapus:", error.response || error.message);
            alert("Gagal menghapus artikel. Cek console untuk detail.");
          });
      }
    },

    saveData() {
      const payload = new URLSearchParams();
      payload.append("judul", this.formData.judul);
      payload.append("isi", this.formData.isi);

      if (this.formData.id) {
        // Update
        axios
          .put(`${apiUrl}/${this.formData.id}`, payload)
          .then(() => this.loadData())
          .catch((error) => console.error(error));
      } else {
        // Tambah
        axios
          .post(apiUrl, payload)
          .then(() => this.loadData())
          .catch((error) => console.error(error));
      }

      this.showForm = false;
      this.formData = {
        id: null,
        judul: "",
        isi: "",
        status: 0,
      };
    },
  },
}).mount("#app");
