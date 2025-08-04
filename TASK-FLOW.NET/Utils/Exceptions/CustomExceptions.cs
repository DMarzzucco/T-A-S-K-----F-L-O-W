namespace TASK_FLOW.NET.Utils.Exceptions
{
    /// <summary>
    /// 409
    /// </summary>
    /// <param name="message"></param>
    public class ConflictExceptions(string message) : Exception(message) { }
    /// <summary>
    /// 400
    /// </summary>
    /// <param name="message"></param>
    public class BadRequestExceptions(string message) : Exception(message) { }

    /// <summary>
    /// 403
    /// </summary>
    /// <param name="message"></param>
    public class ForbiddenExceptions(string message) : Exception(message) { }

    /// <summary>
    /// 429
    /// </summary>
    /// <param name="message"></param>
    public class TooManyRequestsExceptions(string message) : Exception(message) { }
}
