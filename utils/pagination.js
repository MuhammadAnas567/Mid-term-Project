async function paginate(model, page = 1, limit = 10, filter = {}) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalRecords: total,
    data,
  };
}

module.exports = paginate;
