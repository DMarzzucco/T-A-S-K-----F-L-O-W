namespace TASK_FLOW.NET.Utils.Exceptions
{
    /// <summary>
    /// 409
    /// </summary>
    /// <param name="message"></param>
    public class ConflictException(string message) : Exception(message) { }
    /// <summary>
    /// 400
    /// </summary>
    /// <param name="message"></param>
    public class BadRequestException(string message) : Exception(message) { }

    /// <summary>
    /// 403
    /// </summary>
    /// <param name="message"></param>
    public class ForbiddentExceptions(string message) : Exception(message) { }

    /// <summary>
    /// 429
    /// </summary>
    /// <param name="message"></param>
    public class TooManyRequestExceptions(string message) : Exception(message) { }
}
