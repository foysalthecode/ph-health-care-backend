//eikhane T hocche ekta generic type parameter, jar mane moddhe model ta pass kora hobe

import {
  IQueryConfig,
  IQueryParams,
  PrismaCreateArgs,
  PrismaFindManyArgs,
  prismaModelDelegate,
} from "../interfaces/query.interface";

export class QueryBuilder<
  T,
  TWhereUknown = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCreateArgs;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private seletcFields: Record<string, boolean | undefined>;

  constructor(
    private model: prismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.query = {
        where: {},
        include: {},
        orderBy: {},
        skip: 0,
        take: 10,
    };

    this.countQuery = {
        where: {},
    }
  }
}
