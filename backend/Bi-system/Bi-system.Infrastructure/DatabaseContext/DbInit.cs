using Extensions.Hosting.AsyncInitialization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.DatabaseContext;

public class DbInit(BiDbContext biDbContext) : IAsyncInitializer
{
    public async Task InitializeAsync(CancellationToken cancellationToken)
    {
        await biDbContext.Database.MigrateAsync(cancellationToken);
    }

}
