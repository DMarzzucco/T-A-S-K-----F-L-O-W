namespace TASK_FLOW.NET.Utils.Exceptions
{
    /// <summary>
    /// 409
    /// </summary>
    /// <param name="message"></param>
    public class ConflictException(string message) : Exception(message){}
    /// <summary>
    /// 400
    /// </summary>
    /// <param name="message"></param>
    public class BadRequestException(string message) : Exception(message){}
}
