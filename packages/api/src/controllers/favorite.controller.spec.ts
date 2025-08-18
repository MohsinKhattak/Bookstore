// __tests__/favorite.controller.test.ts
import {
  addFavorite,
  deleteFavorite,
  getUserFavorites,
} from './favorite.controller';
import * as favoriteService from '../services/favorite.service';

jest.mock('../services/favorite.service');

type MockReq = Partial<{
  body: any;
  params: any;
  query: any;
  user?: { id: string };
}>;
type MockRes = {
  status: jest.Mock;
  json: jest.Mock;
};

function mockRes(): MockRes {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res as MockRes;
}

describe('favorite.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFavorite', () => {
    it('201 on success', async () => {
      const req: MockReq = { user: { id: 'u1' }, body: { bookId: 'b1' } };
      const res = mockRes();

      (favoriteService.addFavorite as jest.Mock).mockResolvedValue(undefined);

      await addFavorite(req as any, res as any);

      expect(favoriteService.addFavorite).toHaveBeenCalledWith('u1', 'b1');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book added to favorites',
      });
    });

    it('400 when service throws', async () => {
      const req: MockReq = { user: { id: 'u1' }, body: { bookId: 'bad' } };
      const res = mockRes();

      (favoriteService.addFavorite as jest.Mock).mockRejectedValue(
        new Error('Invalid book ID')
      );

      await addFavorite(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID' });
    });
  });

  describe('deleteFavorite', () => {
    it('200 on success', async () => {
      const req: MockReq = { user: { id: 'u1' }, query: { bookId: 'b1' } };
      const res = mockRes();

      (favoriteService.removeFavorite as jest.Mock).mockResolvedValue(
        undefined
      );

      await deleteFavorite(req as any, res as any);

      expect(favoriteService.removeFavorite).toHaveBeenCalledWith('u1', 'b1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book removed from favorites',
      });
    });

    it('400 when service throws', async () => {
      const req: MockReq = { user: { id: 'u1' }, query: { bookId: 'bad' } };
      const res = mockRes();

      (favoriteService.removeFavorite as jest.Mock).mockRejectedValue(
        new Error('Favorite not found')
      );

      await deleteFavorite(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Favorite not found' });
    });
  });

  describe('getUserFavorites', () => {
    it('200 with books payload', async () => {
      const req: MockReq = { user: { id: 'u1' } };
      const res = mockRes();

      (favoriteService.listFavorites as jest.Mock).mockResolvedValue([
        { _id: 'b1', title: 'B1' },
        { _id: 'b2', title: 'B2' },
      ]);

      await getUserFavorites(req as any, res as any);

      expect(favoriteService.listFavorites).toHaveBeenCalledWith('u1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Success',
        books: [
          { _id: 'b1', title: 'B1' },
          { _id: 'b2', title: 'B2' },
        ],
      });
    });

    it('400 when service throws', async () => {
      const req: MockReq = { user: { id: 'u1' } };
      const res = mockRes();

      (favoriteService.listFavorites as jest.Mock).mockRejectedValue(
        new Error('Oops')
      );

      await getUserFavorites(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Oops' });
    });
  });
});
