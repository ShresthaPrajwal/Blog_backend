const defaultLimit = 2;

const paginationMiddleware =
  (Model, base, populate) => async (req, res, next) => {
    try {
      const {
        page = 1,
        size = defaultLimit,
        sort = 'title',
        order = 'asc',
        search = '',
      } = req.query;

      const query = { title: { $regex: search, $options: 'i' } };

      const totalModels = await Model.countDocuments(query);
      const totalPages = Math.ceil(totalModels / size);

      const currentPage = Math.max(1, Math.min(page, totalPages));
      const currentSkip = (currentPage - 1) * size;

      const sortOptions = {};
      sortOptions[sort] = order === 'asc' ? 1 : -1;

      const results = await Model.find(query)
        .sort(sortOptions)
        .limit(parseInt(size, 10))
        .skip(currentSkip)
        .populate(populate);
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
