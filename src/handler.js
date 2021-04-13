const {nanoid} = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
  if (request.payload === null) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  // eslint-disable-next-line max-len
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(10);
  const insertedAt = new Date().toISOString();
  const updateAt = insertedAt;
  const finished = pageCount === readPage ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updateAt,
  };

  books.push(newBook);

  if (newBook.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (books.filter((books) => books.id === id).length > 0) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: `bookId: ${newBook.id}`,

    });

    response.code(201);
    return response;
  }
};


const getAllBooksHandler = (request, h) => {
  // eslint-disable-next-line max-len
  const book = books.map((b) => ({id: b.id, name: b.name, publisher: b.publisher}));
  const response = h.response({
    status: 'success',
    data: book,
  });
  response.code(200);
  return response;
};


const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {book},
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  // eslint-disable-next-line max-len
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const finished = pageCount === readPage ? true : false;
  const updateAt = new Date().toISOString();
  const index = books.findIndex((b) => b.id === id);

  if (request.payload === undefined) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      // eslint-disable-next-line max-len
      name, year, author, summary, publisher, pageCount, readPage, reading, updateAt, finished,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({

    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line max-len
module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
