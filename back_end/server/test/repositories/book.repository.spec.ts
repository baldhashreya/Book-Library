import { expect } from 'chai';
import { mock, instance, when, verify, anything, reset } from 'ts-mockito';
import { BooksRepository } from '../../src/repositories/book.repository';
import { Books, BorrowRecords, Users, UsersModel, BorrowRecordsModel } from 'common';

describe('BooksRepository', () => {
  let booksRepository: BooksRepository;
  let booksModel: any;
  let borrowRecordsModel: any;
  let usersModel: any;

  beforeEach(() => {
    booksRepository = new BooksRepository();
    booksModel = mock<any>();
    borrowRecordsModel = mock<any>();
    usersModel = mock<any>();
  });

  afterEach(() => {
    reset(booksModel);
    reset(borrowRecordsModel);
    reset(usersModel);
  });

  describe('getBookByTitle', () => {
    it('should return count of books with given title and exclude given id', async () => {
      const id = '1234567890';
      const title = 'Test Title';
      when(booksModel.countDocuments(anything())).thenResolve(10);

      const result = await booksRepository.getBookByTitle(title, id);
      expect(result).to.equal(10);
      verify(booksModel.countDocuments({ title, _id: { $ne: id } })).once();
    });

    it('should return count of books with given title', async () => {
      const title = 'Test Title';
      when(booksModel.countDocuments(anything())).thenResolve(10);

      const result = await booksRepository.getBookByTitle(title);
      expect(result).to.equal(10);
      verify(booksModel.countDocuments({ title })).once();
    });
  });

  describe('getAuthorById', () => {
    it('should return count of authors with given id', async () => {
      const id = '1234567890';
      when(booksModel.countDocuments(anything())).thenResolve(10);

      const result = await booksRepository.getAuthorById(id);
      expect(result).to.equal(10);
      verify(booksModel.countDocuments({ _id: id })).once();
    });
  });

  describe('getCategoryById', () => {
    it('should return count of categories with given id', async () => {
      const id = '1234567890';
      when(booksModel.countDocuments(anything())).thenResolve(10);

      const result = await booksRepository.getCategoryById(id);
      expect(result).to.equal(10);
      verify(booksModel.countDocuments({ _id: id })).once();
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'Test Title',
        author: 'Test Author',
        category: 'Test Category',
        publisher: 'Test Publisher',
      };
      when(booksModel.create(anything())).thenResolve(bookData);

      const result = await booksRepository.createBook(bookData);
      expect(result).to.deep.equal(bookData);
      verify(booksModel.create(bookData)).once();
    });
  });

  describe('getBookById', () => {
    it('should return book with given id', async () => {
      const id = '1234567890';
      const bookData = {
        title: 'Test Title',
        author: 'Test Author',
        category: 'Test Category',
        publisher: 'Test Publisher',
      };
      when(booksModel.findById(anything())).thenResolve(bookData);

      const result = await booksRepository.getBookById(id);
      expect(result).to.deep.equal(bookData);
      verify(booksModel.findById({ _id: id })).once();
    });
  });

  describe('updateBook', () => {
    it('should update book with given id', async () => {
      const id = '1234567890';
      const bookData = {
        title: 'Test Title',
        author: 'Test Author',
        category: 'Test Category',
        publisher: 'Test Publisher',
      };
      when(booksModel.findByIdAndUpdate(anything(), anything(), { new: true })).thenResolve(bookData);

      const result = await booksRepository.updateBook(id, bookData);
      expect(result).to.deep.equal(bookData);
      verify(booksModel.findByIdAndUpdate(id, bookData, { new: true })).once();
    });
  });

  describe('deleteBook', () => {
    it('should delete book with given id', async () => {
      const id = '1234567890';
      when(booksModel.findByIdAndDelete(anything())).thenResolve({});

      const result = await booksRepository.deleteBook(id);
      expect(result).to.deep.equal({});
      verify(booksModel.findByIdAndDelete({ _id: id })).once();
    });
  });

  describe('searchBooks', () => {
    it('should return count and rows of books with given params', async () => {
      const params = {
        title: 'Test Title',
        author: 'Test Author',
        category: 'Test Category',
        publisher: 'Test Publisher',
        order: [['title', 'asc']],
        offset: 0,
        limit: 10,
      };
      const query = {
        title: { $regex: 'Test Title', $options: 'i' },
        author: { $regex: 'Test Author', $options: 'i' },
        category: { $regex: 'Test Category', $options: 'i' },
        publisher: { $regex: 'Test Publisher', $options: 'i' },
      };
      const order = { title: 1 };
      const count = 10;
      const rows = [
        {
          title: 'Test Title',
          author: 'Test Author',
          category: 'Test Category',
          publisher: 'Test Publisher',
        },
      ];
      when(booksModel.countDocuments(anything())).thenResolve(count);
      when(booksModel.find(anything()).sort(anything()).skip(anything()).limit(anything())).thenResolve(rows);

      const result = await booksRepository.searchBooks(params);
      expect(result).to.deep.equal({ count, rows });
      verify(booksModel.countDocuments(query)).once();
      verify(booksModel.find(query).sort(order).skip(params.offset || 0).limit(params.limit || 10)).once();
    });
  });

  describe('getUsersByIds', () => {
    it('should return users with given ids', async () => {
      const ids = ['1234567890', '2345678901'];
      const users = [
        {
          _id: '1234567890',
          role: {
            name: 'Test Role',
          },
        },
        {
          _id: '2345678901',
          role: {
            name: 'Test Role',
          },
        },
      ];
      when(usersModel.find(anything()).populate(anything())).thenResolve(users);

      const result = await booksRepository.getUsersByIds(ids);
      expect(result).to.deep.equal(users);
      verify(usersModel.find({ _id: { $in: ids } }).populate('role', 'name')).once();
    });
  });

  describe('createBorrowRecords', () => {
    it('should create a new borrow record', async () => {
      const model = {
        book: 'Test Book',
        user: 'Test User',
        borrowDate: '2022-01-01',
        returnDate: '2022-01-15',
      };
      when(borrowRecordsModel.create(anything())).thenResolve(model);

      const result = await booksRepository.createBorrowRecords(model);
      expect(result).to.deep.equal(model);
      verify(borrowRecordsModel.create(model)).once();
    });
  });
});