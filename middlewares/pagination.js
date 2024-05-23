const defaultLimit = 2;

const paginationMiddleware =
  (model, base, populate = '') =>
  async (req, res, next) => {
    try {
      const {
        page = 1,
        size = defaultLimit,
        sort = 'createdAt',
        order = 'asc',
        search = '',
      } = req.query;
      let results;
      const query = search ? { title: { $regex: search, $options: 'i' } } : {};

      const totalModels = await model.countDocuments(query).exec();
      const totalPages = Math.ceil(totalModels / size);
      console.log(
        'totalmodels and pages',
        totalModels,
        totalPages,
        'model',
        model,
      );
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const currentSkip = (currentPage - 1) * size;

      const sortOptions = {};
      sortOptions[sort] = order === 'asc' ? 1 : -1;
      console.log(
        'from pagination',
        query,
        sortOptions,
        size,
        currentSkip,
        populate,
      );

      if (populate !== '') {
        results = await model
          .find(query)
          .sort(sortOptions)
          .limit(parseInt(size, 10))
          .skip(currentSkip)
          .populate(populate);
      } else {
        results = await model
          .find(query)
          .sort(sortOptions)
          .limit(parseInt(size, 10))
          .skip(currentSkip)
          .exec();
      }

      console.log('from pagination results', results);
      const baseUrl = `${req.protocol}://${req.header('Host')}/api/${base}`;

      const nextPageUrl =
        currentPage < totalPages
          ? `${baseUrl}?page=${currentPage + 1}&size=${size}&sort=${sort}&order=${order}&search=${search}`
          : null;

      const prevPageUrl =
        currentPage > 1
          ? `${baseUrl}?page=${currentPage - 1}&size=${size}&sort=${sort}&order=${order}&search=${search}`
          : null;

      res.paginatedResults = {
        data: results,
        pagination: {
          currentPage,
          totalPages,
          perPage: parseInt(size, 10),
          totalItems: totalModels,
          nextPageUrl,
          prevPageUrl,
        },
      };
      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = paginationMiddleware;
