const {nanoid} = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
        .response({
          status: 'fail',
          // eslint-disable-next-line max-len
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    return response;
  }

  const id = nanoid(10);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((books) => books.id === id).length > 0;

  if (isSuccess) {
    const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },

        })

        .code(201);
    return response;
  }

  const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      })
      .code(500);
  return response;
};


const getAllBooksHandler = (request, h) => {
  const response = h
      .response({
        status: 'success',
        data: {
          books: books.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      })
      .code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book) {
    const response = h
        .response({
          status: 'success',
          data: {
            book,
          },
        })
        .code(200);
    return response;
  }

  const response = h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
        .response({
          status: 'fail',
          message:
          // eslint-disable-next-line max-len
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    return response;
  }
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((b) => b.id === bookId);


  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        })
        .code(200);
    return response;
  }

  const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
    return response;
  }

  const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  return response;
};

module.exports = {addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler};
