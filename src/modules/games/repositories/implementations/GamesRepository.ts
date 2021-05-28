import { getRepository, Repository, Like } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {


    const query = await this.repository
      .createQueryBuilder('games')
      .select('*')
      .where(`games.title  ILIKE '%${param}%'`)
      .groupBy('games.id')
      .addGroupBy('games.title')
      .execute()




    return query

  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT  COUNT(*) FROM games`)
  }

  async findUsersByGameId(id: string): Promise<any> {
    const query = await this.repository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.users', 'user')
      .where('games.id =:id', { id })
      .getOne()

    console.log('findUsersByGameId', query)

    return query?.users


  }
}
