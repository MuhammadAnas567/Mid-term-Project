async function paginate(model, page = 1, limit = 10, filter = {}, populateFields = []) {
  const skip = (page - 1) * limit;

  const query = model.find(filter).skip(skip).limit(limit);

  // Apply populate if provided
  populateFields.forEach((field) => {
    query.populate(field);
  });

  const [data, total] = await Promise.all([
    query,
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
